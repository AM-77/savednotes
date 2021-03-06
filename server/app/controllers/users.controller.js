const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/user.schema");
const db = require("../db");

const subscribe = (req, res) => {
  const { email, password, username } = req.body;
  const { error } = userSchema.validate({ email, password, username });
  if (!error) {
    db.query(`SELECT * FROM users WHERE email = '${email}'`, (dbErr, dbRes) => {
      if (dbErr) {
        res.status(500).json({
          message: "There Was An Error Fetching The User From The DB.",
          error: dbErr,
        });
      } else if (dbRes.length > 0) {
        res.status(409).json({ message: "Email Already Exists." });
      } else {
        bcryptjs.hash(String(password), 7, (bcErr, hashed) => {
          if (bcErr) {
            res.status(500).json({
              message: "There Was An Error In Hashing The Password.",
              error: bcErr,
            });
          } else {
            const user = {
              id: 0,
              username,
              email,
              password: hashed,
            };
            const sql = `INSERT INTO users (id, username, email, password) VALUES (NULL, '${user.username}', '${user.email}', '${user.password}')`;
            db.query(sql, (innerDbErr, innerDbRes) => {
              if (innerDbErr) {
                res.status(500).json({
                  message: "There Was An Error In Creating The User.",
                  error: innerDbErr,
                });
              } else {
                res.status(200).json({
                  message: "The User Created Successfully.",
                  result: innerDbRes,
                  user,
                });
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).json({ message: "Request Unsatisfied.", error });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;
  db.query(`SELECT * FROM users WHERE email = '${email}'`, (dbErr, dbRes) => {
    if (dbErr) {
      res.status(500).json({
        message: "There Was An Error Fetching The User From The DB.",
        error: dbErr,
      });
    } else if (dbRes.length > 0) {
      bcryptjs.compare(String(password), dbRes[0].password, (bcErr, bcRes) => {
        if (bcErr || !bcRes) {
          res.status(401).json({ message: "Invalid Password.", error: bcErr });
        } else {
          const user = {
            id: dbRes[0].id,
            username: dbRes[0].username,
            email,
          };
          const token = jwt.sign(
            { email },
            process.env.JWT_KEY || "15zM4X4S5s0s8E1ApOk4r",
            {
              expiresIn: "7d",
            },
          );
          res.status(200).json({ message: "Logged In.", token, user });
        }
      });
    } else {
      res.status(204).json({ message: "User Does Not Exist." });
    }
  });
};

const getLoggedUser = (req, res) => {
  const { email } = req.verifiedToken;
  db.query(`SELECT * FROM users WHERE email = '${email}'`, (dbErr, dbRes) => {
    if (dbErr) {
      res.status(500).json({
        message: "There Was An Error Getting The User From The DB.",
        error: dbErr,
      });
    } else if (dbRes.length > 0) {
      const { id, username } = dbRes[0];
      res.status(200).json({ result: { id, email, username } });
    } else res.status(401).json({ message: "User Does Not Exist." });
  });
};

const patchUser = (req, res) => {
  const { username, newPassword } = req.body;
  const { email } = req.verifiedToken;
  const { error } = userSchema.validate({
    email,
    password: newPassword,
    username,
  });
  if (!error) {
    let sql = "UPDATE users SET ";
    if (username) sql += ` username = '${username}'`;
    if (newPassword) {
      bcryptjs.hash(String(newPassword), 7, (bcErr, hashed) => {
        if (bcErr) {
          res.status(500).json({
            message: "There Was An Error In Hashing The Password.",
            success: false,
            error: bcErr,
          });
        } else {
          if (username) sql += ",";
          sql += ` password = '${hashed}' WHERE email = '${email}'`;
          db.query(sql, (dbErr, dbRes) => {
            if (dbErr) {
              res.status(500).json({
                message: "There Was An Error Updating The User In The DB.",
                success: false,
                error: dbErr,
              });
            } else {
              res.status(200).json({
                message: "The User Was Updated Successfully.",
                success: true,
                result: dbRes,
              });
            }
          });
        }
      });
    } else {
      sql += ` WHERE email = '${email}'`;
      db.query(sql, (dbErr, dbRes) => {
        if (dbErr) {
          res.status(500).json({
            message: "There Was An Error Updating The User In The DB.",
            success: false,
            error: dbErr,
          });
        } else {
          res.status(200).json({
            message: "The User Was Updated Successfully.",
            success: true,
            result: dbRes,
          });
        }
      });
    }
  } else {
    res.status(400).json({ message: "Request Unsatisfied.", error });
  }
};

const deleteUser = (req, res) => {
  const { email } = req.verifiedToken;
  db.query(`DELETE FROM users WHERE email = '${email}'`, (dbErr, dbRes) => {
    if (dbErr) {
      res.status(500).json({
        message: "There Was An Error Deleting The User From The DB.",
        success: false,
        error: dbErr,
      });
    } else {
      res.status(200).json({
        message: "The User Was Deleted Successfully.",
        success: true,
        result: dbRes,
      });
    }
  });
};

module.exports = { subscribe, login, getLoggedUser, patchUser, deleteUser };

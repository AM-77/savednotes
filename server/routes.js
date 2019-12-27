const express = require("express")
const sn_router = express.Router()
const mysql = require("mysql")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const DB_HOST = process.env.DB_HOST || "localhost"
const DB_USER = process.env.DB_USER || "root"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const DB_NAME = process.env.DB_NAME || "savednotes-db"

const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
})

db.connect((err) => {
    if (err) console.log("[!] There was an error connecting to the database: \n" + err)
    else console.log("[+] Connected to the database.")
})

sn_router.post("/subscribe", (req, res, next) => {
    const { email, password, username } = req.body
    if (email && password && username) {
        db.query(`SELECT * FROM users WHERE email = '${email}'`, (db_err, db_res) => {
            if (db_err) {
                res.status(500).json({ message: "There Was An Error Fetching Data From The DB.", error: db_err })
            } else {
                if (db_res.length > 0) {
                    res.status(409).json({ message: "Email Already Exists." })
                } else {
                    bcryptjs.hash(String(password), 7, (bc_err, hashed) => {
                        if (bc_err) {
                            res.status(500).json({ message: "There Was An Error In Hashing The Password.", error: bc_err })
                        } else {
                            const user = { id: 0, username, email, password: hashed }
                            const sql = "INSERT INTO users SET ?"
                            db.query(sql, user, (db_err, db_res) => {
                                if (db_err) res.status(500).json({ message: "There Was An Error In Creating The User.", error: db_err })
                                else res.status(200).json({ message: "The User Created Successfully.", result: db_res })
                            })
                        }
                    })
                }
            }
        })
    }
    else {
        res.status(400).json({ message: "Request Unsatisfied." })
    }
})

sn_router.post("/login", (req, res, next) => {
    const { email, password } = req.body
    db.query(`SELECT * FROM users WHERE email = '${email}'`, (db_err, db_res) => {
        if (db_err) {
            res.status(500).json({ message: "There Was An Error Fetching Data From The DB.", error: db_err })
        } else {
            bcryptjs.compare(String(password), db_res[0].password, (bc_err, bc_res) => {
                if (bc_err || !bc_res) res.status(401).json({ message: "Authentication Failed.", error: bc_err })
                else {
                    const user = { id: db_res[0].id, username: db_res[0].username, email }
                    let token = jwt.sign({ email }, process.env.JWT_KEY || "15zM4X4S5s0s8E1ApOk4r", { expiresIn: "7d" })
                    res.status(200).json({ message: "Logged In.", token, user })
                }
            })
        }
    })
})

sn_router.get("/notes", (req, res, next) => {
    db.query("SELECT * FROM notes", (db_err, db_res) => {
        if (db_err) {
            res.status(500).json({ message: "There Was An Error Fetching Data From The DB.", error: db_err })
        } else {
            res.status(200).json(db_res)
        }
    })
})

sn_router.get("/notes/:user_id", (req, res, next) => {
    let user_id = req.params.user_id
    db.query(`SELECT * FROM notes WHERE user_id = '${user_id}'`, (db_err, db_res) => {
        if (db_err) {
            res.status(500).json({ message: "There Was An Error Fetching Data From The DB.", error: db_err })
        } else {
            res.status(200).json(db_res)
        }
    })
})

sn_router.get("/note/:note_id", (req, res, next) => {
    let note_id = req.params.note_id
    db.query(`SELECT * FROM notes WHERE id = '${note_id}'`, (db_err, db_res) => {
        if (db_err) {
            res.status(500).json({ message: "There Was An Error Fetching Data From The DB.", error: db_err })
        } else {
            res.status(200).json(db_res)
        }
    })
})

module.exports = sn_router
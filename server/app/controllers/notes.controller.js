const getDate = require("../utils/helpers");
const noteSchema = require("../validation/note.schema");
const db = require("../db");

const getNotesByFolder = (req, res) => {
  const { folder, userId } = req.params;
  let sql;

  switch (folder) {
    case "all":
      sql = "SELECT * FROM notes WHERE privacy = 'public' AND trashed = '0' ";
      break;
    case "myAll":
      sql = `SELECT * FROM notes WHERE trashed = '0' AND userId = '${userId}' `;
      break;
    case "public":
      sql = `SELECT * FROM notes WHERE privacy = 'public' AND trashed = '0' AND userId = '${userId}' `;
      break;
    case "private":
      sql = `SELECT * FROM notes WHERE privacy = 'private' AND trashed = '0' AND userId = '${userId}' `;
      break;
    case "archived":
      sql = `SELECT * FROM notes WHERE archived = '1' AND trashed = '0' AND userId = '${userId}' `;
      break;
    case "trashed":
      sql = `SELECT * FROM notes WHERE trashed = '1' AND userId = '${userId}' `;
      break;
    default:
      sql = "SELECT * FROM notes WHERE privacy = 'public' AND trashed = '0' ";
      break;
  }

  db.query(sql, (dbErr, dbRes) => {
    if (dbErr) {
      res.status(500).json({
        message: "There Was An Error Fetching Data From The DB.",
        error: dbErr,
      });
    } else {
      res.status(200).json(dbRes);
    }
  });
};

const getNotesByUser = (req, res) => {
  const { userId } = req.params;
  db.query(`SELECT * FROM notes WHERE userId = '${userId}'`, (dbErr, dbRes) => {
    if (dbErr) {
      res.status(500).json({
        message: "There Was An Error Fetching Data From The DB.",
        error: dbErr,
      });
    } else {
      res.status(200).json(dbRes);
    }
  });
};

const getNotesById = (req, res) => {
  const { noteId } = req.params;
  db.query(`SELECT * FROM notes WHERE id = '${noteId}'`, (dbErr, dbRes) => {
    if (dbErr) {
      res.status(500).json({
        message: "There Was An Error Fetching Data From The DB.",
        error: dbErr,
      });
    } else {
      res.status(200).json(dbRes);
    }
  });
};

const PostNote = (req, res) => {
  const { userId, title, content, privacy } = req.body;
  const { error } = noteSchema.validate({ userId, title, content, privacy });
  if (!error) {
    const note = {
      id: 0,
      userId,
      title,
      content,
      privacy,
      createdAt: getDate(),
      lastUpdate: getDate(),
    };
    const sql = "INSERT INTO notes SET ?";
    db.query(sql, note, (dbErr, dbRes) => {
      if (dbErr) {
        res.status(500).json({
          message: "There Was An Error Inserting Data Into The DB.",
          error: dbErr,
        });
      } else {
        res.status(200).json({
          message: "The Note Was Inserted Successfully.",
          result: dbRes,
          note,
        });
      }
    });
  } else {
    res.status(400).json({ message: "Request Unsatisfied.", error });
  }
};

const deleteNote = (req, res) => {
  const noteId = Number(req.params.noteId);
  db.query(`DELETE FROM notes WHERE id = '${noteId}'`, (dbErr, dbRes) => {
    if (dbErr) {
      res.status(500).json({
        message: "There Was An Error Deleting Data From The DB.",
        error: dbErr,
      });
    } else {
      res.status(200).json({
        message: "The Note Was Deleted Successfully.",
        result: dbRes,
      });
    }
  });
};

const patchNote = (req, res) => {
  const { id, title, content, archived, privacy, trashed } = req.body;
  const { error } = noteSchema.validate({
    id,
    title,
    content,
    archived,
    privacy,
    trashed,
  });
  if (!error) {
    db.query(
      `UPDATE notes SET title='${title}', content='${content}', lastUpdate='${getDate()}', privacy='${privacy}', archived='${archived}', trashed='${trashed}'  WHERE id=${id}`,
      (dbErr, dbRes) => {
        if (dbErr) {
          res.status(500).json({
            message: "There Was An Error Updating Data In The DB.",
            error: dbErr,
          });
        } else {
          res.status(200).json({
            message: "The Note Was Updated Successfully.",
            result: dbRes,
          });
        }
      },
    );
  } else {
    res.status(400).json({ message: "Request Unsatisfied.", error });
  }
};

const searchNote = (req, res) => {
  const { find } = req.params;
  let sql;

  if (find !== "*") {
    sql = `SELECT userId, archived, content, createdAt, id, lastUpdate, title FROM notes WHERE ( title LIKE '%${find}%' OR content LIKE '%${find}%' ) AND ( privacy = 'public' AND trashed != '1' )`;
  } else {
    sql =
      "SELECT userId, archived, content, createdAt, id, lastUpdate, title FROM notes WHERE ( privacy = 'public' AND trashed != 1 )";
  }
  db.query(sql, (dbErr, dbRes) => {
    if (dbErr) {
      res.status(500).json({
        message: "There Was An Error Fetching Data In The DB.",
        error: dbErr,
      });
    } else {
      res.status(200).json({ result: dbRes });
    }
  });
};

module.exports = {
  getNotesByFolder,
  getNotesByUser,
  getNotesById,
  PostNote,
  deleteNote,
  patchNote,
  searchNote,
};

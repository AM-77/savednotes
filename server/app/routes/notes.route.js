const express = require("express");

const notesRouter = express.Router();
const authentication = require("../middlewares/authentication");
const {
  getNotesByFolder,
  getNotesByUser,
  getNotesById,
  PostNote,
  deleteNote,
  patchNote,
  searchNote,
} = require("../controllers/notes.controller");

notesRouter.post("/", authentication, PostNote);

notesRouter.patch("/", authentication, patchNote);

notesRouter.delete("/:noteId", authentication, deleteNote);

notesRouter.get("/:noteId", authentication, getNotesById);

notesRouter.get("/user/:userId", authentication, getNotesByUser);

notesRouter.get("/search/:find", authentication, searchNote);

notesRouter.get("/:folder/:userId", authentication, getNotesByFolder);

module.exports = notesRouter;

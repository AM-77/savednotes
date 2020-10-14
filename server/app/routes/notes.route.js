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

notesRouter.get("/:folder/:userId", authentication, getNotesByFolder);

notesRouter.get("/user/:userId", authentication, getNotesByUser);

notesRouter.get("/:noteId", authentication, getNotesById);

notesRouter.post("/", authentication, PostNote);

notesRouter.delete("/:noteId", authentication, deleteNote);

notesRouter.patch("/", authentication, patchNote);

notesRouter.get("/search/:find", authentication, searchNote);

module.exports = notesRouter;

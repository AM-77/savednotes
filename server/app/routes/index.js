const express = require("express");
const router = express.Router();
const notesRouter = require("./notes.route")
const usersRouter = require("./users.route")

router.use("/notes", notesRouter)
router.use("/users", usersRouter)

module.exports = router

const express = require("express");

const usersRouter = express.Router();
const authentication = require("../middlewares/authentication");
const {
  subscribe,
  login,
  patchUser,
  deleteUser,
  getLoggedUser,
} = require("../controllers/users.controller");

usersRouter.get("/", authentication, getLoggedUser);

usersRouter.patch("/", authentication, patchUser);

usersRouter.delete("/", authentication, deleteUser);

usersRouter.post("/login", login);

usersRouter.post("/subscribe", subscribe);

module.exports = usersRouter;

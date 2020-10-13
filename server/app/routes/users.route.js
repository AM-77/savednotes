const express = require("express");
const usersRouter = express.Router();
const authentication = require("../middlewares/authentication");
const { subscribe, login, patchUser, deleteUser, getLoggedUser } = require("../controllers/users.controller");

usersRouter.post("/subscribe", subscribe);

usersRouter.post("/login", login);

usersRouter.get("/", authentication, getLoggedUser);

usersRouter.patch("/", authentication, patchUser);

usersRouter.delete("/", authentication, deleteUser);

module.exports = usersRouter;

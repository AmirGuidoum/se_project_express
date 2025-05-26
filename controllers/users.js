const {
  ERROR_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
} = require("../utils/constant");
const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((users) => res.status(201).send(users))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(NOT_FOUND_CODE).send({ message: "Item not found" });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};
const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "Invalid item ID format" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_CODE).send({ message: "Item not found" });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};
module.exports = { getUsers, createUser, getUser };

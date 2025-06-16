const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");
const {
  ERROR_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  CONFLICT_CODE,
  INVALID_CREDENTIALS,
} = require("../utils/constant");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODE)
      .send({ message: "Email and password are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(ERROR_CODE).send({ message: "Invalid email format" });
  }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) =>
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res
          .status(CONFLICT_CODE)
          .send({ message: "Email already in use" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "Invalid user data provided" });
      }

      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
  return null;
};
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "Invalid user ID format" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_CODE).send({ message: "User not found" });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODE)
      .send({ message: "Email and password are required" });
  }

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Invalid credentials"));
      }

      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return Promise.reject(new Error("Invalid credentials"));
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        return res.send({
          token,
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
          },
        });
      });
    })
    .catch((err) => {
      console.error(err);

      if (err.message === "Invalid credentials") {
        return res
          .status(INVALID_CREDENTIALS)
          .send({ message: "Invalid email or password" });
      }

      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: "An unexpected error occurred" });
    });

  return null;
};
const updateUserProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((updatedUser) => res.status(200).send(updatedUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "Invalid user data provided" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_CODE).send({ message: "User not found" });
      }
      console.error(err);
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};
module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateUserProfile,
};

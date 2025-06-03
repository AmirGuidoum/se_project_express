const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { NOT_FOUND_CODE } = require("./utils/constant");
const {
  login,
  createUser,
  getCurrentUser,
  updateUserProfile,
} = require("./controllers/users");
const auth = require("./middleware/auth");
const clothingItemRouter = require("./routes/clothingItem");

const app = express();
app.use(cors());
const { PORT = 3001 } = process.env;
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);
app.use(express.json());
app.post("/signin", login);
app.post("/signup", createUser);
app.use("/items", clothingItemRouter);
app.use(auth);
app.get("/users/me", getCurrentUser);
app.patch("/users/me", updateUserProfile);
app.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: "Not Found" });
});

app.listen(PORT, () => {});

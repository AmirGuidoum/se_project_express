const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes");
const cors = require("cors");
const { ERROR_CODE } = require("./utils/constant");
const {
  login,
  createUser,
  getCurrentUser,
  updateUserProfile,
} = require("./controllers/users");
const auth = require("./middleware/auth");
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
//app.post("/signin", require("./routes/signin"));
//app.post("/signup", require("./routes/signup"));
//app.get("/items", require("./routes/items"));
app.use(auth);
app.get("/users/me", getCurrentUser);
app.patch("/users/me", updateUserProfile);
app.use((req, res) => {
  res.status(ERROR_CODE).send({ message: "Not Found" });
});

app.use(mainRouter);
app.listen(PORT, () => {});

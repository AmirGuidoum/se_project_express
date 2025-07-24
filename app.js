require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const { errors } = require("celebrate");

const auth = require("./middleware/auth");
const userRoutes = require("./routes/users");
const clothingItemRouter = require("./routes/clothingItem");
const { errorHandler } = require("./middleware/errorHandle");
const AppError = require("./utils/AppError");
const { NOT_FOUND_CODE } = require("./utils/constant");
const { login, createUser } = require("./controllers/users");
const {
  loginValidation,
  registerValidation,
} = require("./middleware/validations/authValidation");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

app.use(
  morgan("combined", {
    stream: fs.createWriteStream(path.join(logDirectory, "access.log"), {
      flags: "a",
    }),
  })
);

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello from root route");
});
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.post("/signin", loginValidation, login);
app.post("/signup", registerValidation, createUser);
app.use("/items", clothingItemRouter);

app.use(auth);

app.use("/users", userRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, NOT_FOUND_CODE));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

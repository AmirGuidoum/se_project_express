const router = require("express").Router();

const { NOT_FOUND_CODE } = require("../utils/constant");

const userRoutes = require("./users");

const { getCurrentUser } = require("../controllers/users");

const clothingItem = require("./clothingItem");

router.use("/items", clothingItem);
router.use("/users", userRoutes);
router.get("/users/me", getCurrentUser);
router.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ messgae: "Router not found" });
});
module.exports = router;

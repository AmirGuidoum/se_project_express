const {
  ERROR_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
} = require("../utils/constants");
const router = require("express").Router();
const clothingItem = require("./clothingItem.js");
router.use("/items", clothingItem);
router.use((req, res) => {
  res.status(SERVER_ERROR_CODE).send({ messgae: "Router not found" });
});
module.exports = router;

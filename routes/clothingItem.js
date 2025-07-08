const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

const {
  createItemValidation,
  idParamValidation,
} = require("../middleware/validations/itemValidation");

router.get("/", getItems);
router.post("/", auth, createItemValidation, createItem);
router.delete("/:itemId", auth, idParamValidation, deleteItem);
router.put("/:itemId/likes", auth, idParamValidation, likeItem);
router.delete("/:itemId/likes", auth, idParamValidation, dislikeItem);

module.exports = router;

const {
  ERROR_CODE,
  SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
} = require("../utils/constant");
const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body;
  ClothingItem.create({ name, weather, imageURL, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "Invalid data provided for item creation" });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: "Invalid data provided for item creation" });
    });
};
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() =>
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: "An error has ocurred on the server" })
    );
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(204).send({}))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_CODE).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "Invalid item ID format" });
      }
      console.error(err);
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};
const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        return res.status(NOT_FOUND_CODE).send({ message: "Item not found" });
      }
      return res.status(200).send({ data: updatedItem });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "Invalid item ID format" });
      }
      return res.status(SERVER_ERROR_CODE).send({
        message: "Error while liking item",
        error: "An internal server error occurred.",
      });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        return res.status(NOT_FOUND_CODE).send({ message: "Item not found" });
      }
      return res.status(200).send({ data: updatedItem });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "Invalid item ID format" });
      }
      return res.status(SERVER_ERROR_CODE).send({
        message: "Error while unliking item",
        error: "An internal server error occurred.",
      });
    });
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};

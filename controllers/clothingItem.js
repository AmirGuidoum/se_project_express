const {
  ERROR_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
} = require("../utils/constants");
const ClothingItem = require("../models/clothingItem");
const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  const { name, weather, imageURL } = req.body;
  ClothingItem.create({ name, weather, imageURL })
    .then((item) => {
      console.log(item);
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
    .catch(() => {
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: "An error has ocurred on the server" });
    });
};
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;
  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: "Error from updateItem", e });
    });
};
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((e) => {
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: "Error from updateItem", e });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};

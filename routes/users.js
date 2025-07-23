const express = require("express");

const router = express.Router();

const { getCurrentUser, updateUserProfile } = require("../controllers/users");

const {
  updateUserValidation,
} = require("../middleware/validations/userValidation");

router.get("/me", getCurrentUser);

router.patch("/me", updateUserValidation, updateUserProfile);

module.exports = router;

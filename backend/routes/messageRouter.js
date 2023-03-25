const express = require("express");
const {
  createMessage,
  allMessages,
} = require("../controller/messageController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createMessage);
router.route("/:chatId").get(protect, allMessages);

module.exports = router;

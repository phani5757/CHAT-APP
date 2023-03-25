const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controller/chatController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroup);
router.route("/rename").put(protect, renameGroup);
router.route("/group-add").put(protect, addToGroup);
router.route("/group-remove").put(protect, removeFromGroup);

module.exports = router;

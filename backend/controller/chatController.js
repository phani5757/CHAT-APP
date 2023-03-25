const asyncHandler = require("express-async-handler");
const Chat = require("../model/chatModel");
const User = require("../model/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("User Id is not sent");
  }
  let userChat = await Chat.find({
    groupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("lastMessage");

  userChat = await User.populate(userChat, {
    path: "lastMessage.sender",
    select: "name email pic",
  });

  if (userChat.length > 0) {
    res.send(userChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      groupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const chatWithDetails = await Chat.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");

      res.status(200);
      res.send(chatWithDetails);
    } catch (error) {
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    let chatList = await Chat.find({
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("lastMessage");
    chatList = await User.populate(chatList, {
      path: "lastMessage.sender",
      select: "name email pic",
    });
    res.status(200).send(chatList);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const createGroup = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res
      .status(400)
      .send({ message: "Please fill all the field details" });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send({ message: "To create group should have at least two users" });
  }

  users.push(req.user);

  console.log(users);
  try {
    const newGroup = await Chat.create({
      chatName: req.body.name,
      groupChat: true,
      users,
      groupAdmin: req.user,
    });

    const newGroupDetails = await Chat.find({ _id: newGroup._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(newGroupDetails);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (updatedChat) {
    res.status(200).send(updatedChat);
  } else {
    res.status(400);
    throw new Error("Chat not found");
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (updatedChat) {
    res.status(200).send(updatedChat);
  } else {
    res.status(400);
    throw new Error("Chat not found");
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (updatedChat) {
    res.status(200).send(updatedChat);
  } else {
    res.status(400);
    throw new Error("Chat not found");
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
};

const Chat = require("../models/chats");
const User = require("../models/users");

const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId not sent with request!");
    return res.status(400).send();
  }

  try {
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password -tokens")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email avatar",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  } catch (error) {
    console.log(error);
    if (error.name === "MongoServerError" && error.code === 11000) {
      res.send({
        status: 400,
        message: "Duplicate key error: User already exists.",
      });
    } else {
      res
        .status(500)
        .json({ message: "An error occurred while processing your request." });
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password -tokens")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name avatar email",
        });

        res.send(result);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ error: "Please fill all the fields!" });
  }
  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send({ error: "More than 2 people are needed to form a Group!" });
  }

  users.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password -tokens")
      .populate("groupAdmin", "-password -tokens");

    res.send(fullGroupChat);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      { new: true }
    )
      .populate("users", "-password -tokens")
      .populate("groupAdmin", "-password -tokens");

    if (!updatedChat) {
      res.status(400);
      throw new Error("Chat not found!");
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addToGroup = async (req, res) => {
  const chatId = req.body.chatId;
  const newUsers = JSON.parse(req.body.users);
  if (!newUsers || !chatId) {
    return res.status(400).send({ error: "Please fill all the fields!" });
  }

  Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: newUsers },
    },
    { new: true }
  )
    .populate("users", "-password -tokens")
    .populate("groupAdmin", "-password -tokens")
    .then((updatedGroup) => {
      res.send(updatedGroup);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(error);
    });
};

const removeFromGroup = async (req, res) => {
  const chatId = req.body.chatId;
  const newUser = req.body.user;
  if (!newUser || !chatId) {
    return res.status(400).send({ error: "Please fill all the fields!" });
  }
  try {
    let gc = await Chat.findById(chatId);

    gc.users = gc.users.filter((user) => {
      return newUser != user;
    });

    await gc.save();

    Chat.findById(chatId)
      .populate("users", "-password -tokens")
      .populate("groupAdmin", "-password -tokens")
      .then((result) => res.send(result))
      .catch((e) => {
        throw new Error(e);
      });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const cleanIndexes = async (req, res) => {
  try {
    await Chat.cleanIndexes();
    res.send("ok!");
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  cleanIndexes,
};

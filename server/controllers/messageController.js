const Chat = require("../models/chats");
const User = require("../models/users");
const Message = require("../models/messages");

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    res.status(400);
    res.send("Invalid data passed into request!");
  }
  try {
    const newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name avatar");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name avatar email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    }).populate("latestMessage");

    res.send(message);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const allMessages = async (req, res) => {
  try {
    let messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email avatar")
      .populate("chat");

    let chat =
      messages.length === 0
        ? await Chat.findById(req.params.chatId).populate(
            "users",
            "-password -tokens"
          )
        : messages[0].chat; // Assuming all messages belong to the same chat

    const isGroupChat = chat.isGroupChat;

    if (isGroupChat) {
      res.send({ messages: messages, chatName: chat.chatName });
    } else {
      if (chat.users[0]._id.toString() === req.user._id.toString()) {
        User.findById(chat.users[1]._id)
          .then((u) => {
            res.send({ messages: messages, chatName: u.name });
          })
          .catch((e) => {
            throw new Error(e);
          });
      } else {
        User.findById(chat.users[0]._id)
          .then((u) => {
            res.send({ messages: messages, chatName: u.name });
          })
          .catch((e) => {
            throw new Error(e);
          });
      }
    }
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = { sendMessage, allMessages };

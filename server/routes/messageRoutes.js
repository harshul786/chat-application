const express = require("express");
const auth = require("../middleware/auth");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");
const router = express.Router();

router.use(auth);

router.post("/send-message", sendMessage);
router.get("/:chatId", allMessages);

module.exports = router;

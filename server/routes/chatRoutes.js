const express = require("express");
const auth = require("../middleware/auth");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");
const router = express.Router();

router.use(auth);

router.post("/access", accessChat);
router.get("/fetch", fetchChats);
router.post("/create-group", createGroupChat);
router.put("/rename-group", renameGroup);
router.put("/add-to-group", addToGroup);
router.delete("/remove-from-group", removeFromGroup);

module.exports = router;

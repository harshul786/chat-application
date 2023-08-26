const express = require("express");
const auth = require("../middleware/auth");
const chatRouter = express.Router();

chatRouter.use(auth);
chatRouter.get("/", (req, res) => {
  res.send("hello");
});

module.exports = chatRouter;

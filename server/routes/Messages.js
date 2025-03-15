const express = require("express");
const { Messages } = require("../models");

const router = express.Router();

// Get all messages from a specific chat ID
router.get("/:chatId", async (req, res) => {
  const { chatId } = req.params;

  const messages = await Messages.findAll({
    where: { ChatId: chatId },
    order: [["createdAt", "ASC"]],
  });

  res.json(messages);
});

module.exports = router;

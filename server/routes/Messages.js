const express = require("express");
const { Messages } = require("../models");
const { validateToken } = require("../middleware/AuthMiddleware");

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

router.post("/", validateToken, async (req, res) => {
  const { chatId, text } = req.body;

  const userId = req.user.id;

  const message = await Messages.create({
    chatId,
    userId,
    text,
  });

  res.json(message);
});

module.exports = router;

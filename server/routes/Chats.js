const express = require("express");
const router = express.Router();
const { Chats } = require("../models");
const { validateToken } = require("../middleware/AuthMiddleware");
const { Op } = require("sequelize");

router.get("/", validateToken, async (req, res) => {
  const chats = await Chats.findAll({
    where: {
      [Op.or]: [{ userId: req.user.id }, { userId2: req.user.id }],
    },
  });

  res.json(chats);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const chat = await Chats.findByPk(id);

  res.json(chat);
});

module.exports = router;

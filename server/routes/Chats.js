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

module.exports = router;

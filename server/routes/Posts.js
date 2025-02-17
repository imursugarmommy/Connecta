const express = require("express");
const router = express.Router();
const { Posts } = require("../models");
const { validateToken } = require("../middleware/AuthMiddleware");

router.get("/", async (req, res) => {
  const postList = await Posts.findAll({
    limit: 50,
    order: [["updatedAt", "DESC"]],
  });

  res.json(postList);
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  const user = req.user;

  post.username = user.username;
  post.userId = user.id;

  await Posts.create(post);

  res.json(post);
});

module.exports = router;

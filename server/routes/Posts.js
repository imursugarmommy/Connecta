const express = require("express");
const router = express.Router();
const { Posts, Likes, Comments } = require("../models");
const { validateToken } = require("../middleware/AuthMiddleware");

router.get("/", async (req, res) => {
  const postList = await Posts.findAll({
    include: [Likes, Comments],
    limit: 50,
    order: [["updatedAt", "DESC"]],
  });

  res.json(postList);
});

router.get("/byid/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findAll({
    where: { id: id },
    include: [Likes, Comments],
  });

  res.json(post);
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  const user = req.user;

  post.username = user.username;
  post.UserId = user.id;

  await Posts.create(post);

  res.json(post);
});

module.exports = router;

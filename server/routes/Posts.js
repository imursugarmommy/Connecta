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

router.get("/byuserid/:id", async (req, res) => {
  const id = req.params.id;
  const postList = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
    order: [["updatedAt", "DESC"]],
  });

  res.json(postList);
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  const user = req.user;

  post.username = user.username;
  post.UserId = user.id;

  await Posts.create(post);

  res.json(post);
});

router.delete("/:postId", validateToken, async (req, res) => {
  // req.params graps number entered in url
  const postId = req.params.postId;

  await Posts.destroy({ where: { id: postId } });

  res.json("Post Deleted");
});

module.exports = router;

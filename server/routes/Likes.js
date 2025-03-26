const express = require("express");
const router = express.Router();
const { Likes, Posts } = require("../models");
const { validateToken } = require("../middleware/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
  const { PostId } = req.body;
  const UserId = req.user.id;

  // check if post is already liked
  const found = await Likes.findOne({
    where: { PostId: PostId, UserId: UserId },
  });

  // if post is not liked
  if (!found) {
    await Likes.create({ PostId: PostId, UserId: UserId });
    res.json({ liked: true });
  }
  // if post is already liked
  else {
    await Likes.destroy({ where: { PostId: PostId, UserId: UserId } });
    res.json({ liked: false });
  }
});

// get all likes from a user return its posts
router.get("/byuserid/:id", async (req, res) => {
  const id = req.params.id;
  const postList = await Likes.findAll({
    where: { UserId: id },
    include: [Posts],
    order: [["updatedAt", "DESC"]],
  });

  res.json(postList);
});

module.exports = router;

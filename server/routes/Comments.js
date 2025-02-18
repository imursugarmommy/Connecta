const express = require("express");
const router = express.Router();
const { Comments } = require("../models");

const { validateToken } = require("../middleware/AuthMiddleware");

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comments.findAll({
    where: { PostId: postId },
    order: [["updatedAt", "DESC"]],
  });

  res.json(comments);
});

router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  const username = req.user.username;

  comment.username = username;

  const result = await Comments.create(comment);

  res.json(result);
});

router.delete("/:commentId", validateToken, async (req, res) => {
  // req.params graps number entered in url
  const commentId = req.params.commentId;

  await Comments.destroy({ where: { id: commentId } });

  res.json("Comment Deleted");
});

module.exports = router;

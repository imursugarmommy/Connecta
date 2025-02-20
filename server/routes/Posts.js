const express = require("express");
const router = express.Router();
const { Posts, Likes, Comments } = require("../models");
const { Op } = require("sequelize");
const { validateToken } = require("../middleware/AuthMiddleware");

router.get("/", async (req, res) => {
  const searchparam = req.query.searchparam;
  try {
    let posts;
    if (searchparam) {
      posts = await Posts.findAll({
        where: {
          [Op.or]: [
            {
              content: {
                [Op.like]: `%${searchparam}%`,
              },
            },
            {
              title: {
                [Op.like]: `%${searchparam}%`,
              },
            },
          ],
        },
        include: [Likes, Comments],
        limit: 50,
        order: [["updatedAt", "DESC"]],
      });
    } else {
      posts = await Posts.findAll({
        include: [Likes, Comments],
        limit: 50,
        order: [["updatedAt", "DESC"]],
      });
    }
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

router.delete("/:postId", validateToken, async (req, res) => {
  // req.params graps number entered in url
  const postId = req.params.postId;

  await Posts.destroy({ where: { id: postId } });

  res.json("Post Deleted");
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { Posts, Likes, Comments } = require("../models");
const { validateToken } = require("../middleware/AuthMiddleware");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/posts");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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

router.post(
  "/",
  validateToken,
  upload.single("postImage"),
  async (req, res) => {
    const post = req.body;
    const user = req.user;
    const postImage = req.file.filename;

    post.username = user.username;
    post.UserId = user.id;
    post.postImage = postImage;

    await Posts.create(post);

    res.json(post);
  }
);

router.delete("/:postId", validateToken, async (req, res) => {
  // req.params graps number entered in url
  const postId = req.params.postId;

  await Posts.destroy({ where: { id: postId } });

  res.json("Post Deleted");
});

module.exports = router;

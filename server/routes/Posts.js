const express = require("express");
const router = express.Router();
const { Posts, Likes, Comments, Users } = require("../models");
const { validateToken } = require("../middleware/AuthMiddleware");

const fs = require("fs");
const path = require("path");
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
    let file = req.file;

    console.log(req.user);

    if (file) file = req.file.filename;
    else file = null;

    post.profileImage = user.profileImage;
    post.username = user.username;
    post.name = user.name;
    post.UserId = user.id;
    post.postImage = file;

    await Posts.create(post);

    res.json(post);
  }
);

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  const post = await Posts.findOne({ where: { id: postId } });
  const originalimage = post.postImage;

  if (originalimage) {
    const imagePath = path.join(__dirname, "../images/posts", originalimage);
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Failed to delete original image: ", err);
    });
  }

  await Posts.destroy({ where: { id: postId } });

  res.json("Post Deleted");
});

module.exports = router;

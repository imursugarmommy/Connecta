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

    post.UserId = user.id;
    post.postImage = file;

    const newPost = await Posts.create(post);

    res.json(newPost);
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

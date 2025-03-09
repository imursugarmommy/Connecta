const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Users } = require("../models");
require("dotenv").config();

const multer = require("multer");
const { sign } = require("jsonwebtoken");

const { validateToken } = require("../middleware/AuthMiddleware");
const { where, Op } = require("sequelize");

const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/users");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// get all users
router.get("/", async (req, res) => {
  const users = await Users.findAll();

  res.json(users);
});

// register new user
router.post("/", async (req, res) => {
  const { email, name, username, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      email,
      username,
      name,
      password: hash,
    });
  });

  res.json({ message: "User created" });
});

// log into account
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({
    where: {
      username,
    },
  });

  if (!user) return res.json({ error: "User does not exist" });

  bcrypt.compare(password, user.password).then((match) => {
    if (!match) return res.json({ error: "Wrong username or password" });

    const accessToken = sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
        name: user.name,
      },
      process.env.JWT_SECRET
    );

    res.json(accessToken);
  });
});

router.get("/auth", validateToken, async (req, res) => {
  res.json(req.user);
});

router.get("/:input", async (req, res) => {
  const { input } = req.params;

  const users = await Users.findAll({
    where: {
      [Op.or]: [{ username: input }, { email: input }],
    },
  });

  if (!users || users.length === 0)
    return res.json({ error: "No matching users found" });

  res.json(users);
});

router.post(
  "/picture",
  validateToken,
  upload.single("profileImage"),
  async (req, res) => {
    const userId = req.user.id;
    const user = await Users.findOne({ where: { id: userId } });
    const originalImage = user.profileImage;
    const profileImage = req.file.filename;

    try {
      if (originalImage) {
        const imagePath = path.join(
          __dirname,
          "../images/users",
          originalImage
        );
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Failed to delete original image: ", err);
        });
      }

      await Users.update({ profileImage }, { where: { id: userId } });
      res.json({ message: "Profile image updated", profileImage });
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile image" });
    }
  }
);

module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Users } = require("../models");
require("dotenv").config();

const { sign } = require("jsonwebtoken");

const { validateToken } = require("../middleware/AuthMiddleware");

// get all users
router.get("/", async (req, res) => {
  const users = await Users.findAll();

  res.json(users);
});

// register new user
router.post("/", async (req, res) => {
  const { email, username, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      email,
      username,
      password: hash,
    });
  });

  res.json("User created");
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
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET
    );

    res.json(accessToken);
  });
});

router.get("/auth", validateToken, async (req, res) => {
  res.json(req.user);
});

router.get("/:username", async (req, res) => {
  const { username } = req.params;

  const user = await Users.findOne({
    where: {
      username,
    },
  });

  if (!user) return res.json({ error: "User does not exist" });

  res.json(user);
});

module.exports = router;

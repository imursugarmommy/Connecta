const express = require("express");
const router = express.Router();
const { Followers } = require("../models");
require("dotenv").config();

const { validateToken } = require("../middleware/AuthMiddleware");

router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  const followers = await Followers.findOne({
    where: { userId },
  });

  if (!followers) return res.json({ following: false });

  res.json({ following: true });
});

router.post("/:id", validateToken, async (req, res) => {
  const userId = req.user.id;
  const targetUserId = req.params.id;

  try {
    const existingFollow = await Followers.findOne({
      where: { userId: targetUserId, followerId: userId },
    });

    if (existingFollow) {
      // * Unfollow if already following
      await existingFollow.destroy();
      return res.json({ following: false });
    } else {
      // * Follow if not already following
      await Followers.create({ userId: targetUserId, followerId: userId });
      return res.json({ following: true });
    }
  } catch (error) {
    console.error("Error handling follow/unfollow:", error);
    res
      .status(500)
      .json({ error: "An error occurred. Please try again later." });
  }
});

module.exports = router;

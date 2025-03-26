const express = require("express");
const router = express.Router();
const { Followers, Chats } = require("../models");
const { Op } = require("sequelize");

require("dotenv").config();

const { validateToken } = require("../middleware/AuthMiddleware");

router.get("/mutual/:id", validateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const following = await Followers.findAll({
      where: { followerId: userId },
      attributes: ["userId"],
    });

    const followingIds = following.map((follow) => follow.userId);

    const mutualFollowers = await Followers.findAll({
      where: {
        userId: userId,
        followerId: followingIds,
      },
      attributes: ["followerId"],
    });

    const mutualFollowerIds = mutualFollowers.map(
      (follow) => follow.followerId
    );

    for (const mutualFollowerId of mutualFollowerIds) {
      const existingChat = await Chats.findOne({
        where: {
          [Op.or]: [
            { userId: userId, userId2: mutualFollowerId },
            { userId: mutualFollowerId, userId2: userId },
          ],
        },
      });

      if (!existingChat) {
        await Chats.create({
          userId: userId,
          userId2: mutualFollowerId,
        });
      }
    }

    res.json("Chats updated");
  } catch (error) {
    console.error("Error fetching mutual friends:", error);
    res
      .status(500)
      .json({ error: "An error occurred. Please try again later." });
  }
});

router.get("/:id", validateToken, async (req, res) => {
  const userId = req.params.id;

  const followers = await Followers.findOne({
    where: { userId, followerId: req.user.id },
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
  }
});

router.get("/followers/:id", async (req, res) => {
  const userId = req.params.id;

  const followers = await Followers.findAll({
    where: { userId },
  });

  res.json(followers);
});

router.get("/following/:id", async (req, res) => {
  const userId = req.params.id;

  const following = await Followers.findAll({
    where: { followerId: userId },
  });

  res.json(following);
});

module.exports = router;

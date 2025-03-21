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

module.exports = router;

const express = require("express");
const router = express.Router();
const { Posts } = require("../models");
const { Op } = require("sequelize");

router.get('/', async (req, res) => {
  const searchparam = req.query.searchparam;
  try {
    let posts;
    if (searchparam) {
      posts = await Posts.findAll({
        where: {
          content: {
            [Op.like]: `%${searchparam}%`
          }
        }
      });
    } else {
      posts = await Posts.findAll();
    }
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const post = req.body;
  await Posts.create(post);

  res.json(post);
});

module.exports = router;
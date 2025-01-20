const { verify } = require("jsonwebtoken");
require("dotenv").config();

const validateToken = (req, res, next) => {
  const acccessToken = req.header("accessToken");

  if (!acccessToken) return res.json({ error: "User not logged in" });

  try {
    const validToken = verify(acccessToken, process.env.ACCESSTOKEN);

    req.user = validToken;

    if (validToken) return next();
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = { validateToken };

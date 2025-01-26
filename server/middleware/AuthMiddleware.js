const { verify } = require("jsonwebtoken");
require("dotenv").config();

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  console.log("access token: ", accessToken);

  if (!accessToken) return res.json({ error: "User not logged in" });

  try {
    const validToken = verify(accessToken, "VY0udrD19G9WKCLM1BmnZsALmfPn");
    console.log(validToken);

    req.user = validToken;

    if (validToken) return next();
  } catch (err) {
    console.log("Validation Error: ", err);
    return res.json({ error: err });
  }
};

module.exports = { validateToken };

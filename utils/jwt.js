const jwt = require("jsonwebtoken");

function generateAccessToken(email, id) {
  return jwt.sign({ email, id }, process.env.TOKEN_SECRET, {
    expiresIn: "1800s",
  });
}

module.exports = { generateAccessToken };

const jwt = require("jsonwebtoken");

function generateAccessToken(email) {
  return jwt.sign({ email: email }, process.env.TOKEN_SECRET, {
    expiresIn: "1800s",
  });
}

module.exports = { generateAccessToken };

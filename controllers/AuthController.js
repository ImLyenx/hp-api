const bcrypt = require("bcrypt");
const PrismaClient = require("../config/prisma");
const { generateAccessToken } = require("../utils/jwt");

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await PrismaClient.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = generateAccessToken(email, user.id);

      return res.json({ token });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();

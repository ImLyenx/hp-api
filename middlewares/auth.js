const jwt = require("jsonwebtoken");
const PrismaClient = require("../config/prisma");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, data) => {
    if (err) return res.sendStatus(403);

    const user = await PrismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

module.exports = { authenticateToken };

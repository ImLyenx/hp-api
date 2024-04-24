const PrismaClient = require("../config/prisma");

class UserCardsController {
  async index(req, res) {
    try {
      const { id } = req.user;
      const userCards = await PrismaClient.userCard.findMany({
        where: {
          userId: id,
        },
        include: {
          card: true,
        },
      });
      res.send(userCards);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the user's cards" });
    }
  }

  async store(req, res) {
    try {
      const { id } = req.user;
      const { cardId } = req.body;
      const userCard = await PrismaClient.userCard.create({
        data: {
          userId: id,
          cardId,
        },
        include: {
          card: true,
        },
      });
      res.json(userCard);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the user's card" });
    }
  }
}

module.exports = new UserCardsController();

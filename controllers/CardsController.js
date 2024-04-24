const PrismaClient = require("../config/prisma");

class CardsController {
  async index(req, res) {
    try {
      const cards = await PrismaClient.Card.findMany();
      res.send(cards);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the cards" });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const card = await PrismaClient.Card.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      res.json(card);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the card" });
    }
  }

  async showMultiple(req, res) {
    try {
      const { ids } = req.body;
      const cards = await PrismaClient.Card.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
      res.json(cards);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the cards" });
    }
  }
}

module.exports = new CardsController();

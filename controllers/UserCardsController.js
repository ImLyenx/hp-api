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
        orderBy: [
          {
            isFavorite: "desc",
          },
          {
            card: {
              id: "asc",
            },
          },
        ],
      });
      res.send(userCards);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the user's cards" });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const userCard = await PrismaClient.userCard.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          card: true,
        },
      });
      res.send(userCard);
    } catch (error) {
      console.error(error);
      res

        .status(500)
        .json({ error: "An error occurred while fetching the user's card" });
    }
  }

  async getUserCards(req, res) {
    try {
      const { id } = req.params;
      const userCards = await PrismaClient.userCard.findMany({
        where: {
          userId: parseInt(id),
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

  async setFavorite(req, res) {
    try {
      const { id } = req.user;
      const { cardId, setTo } = req.body;
      const userCard = await PrismaClient.userCard.update({
        where: {
          userId_cardId: {
            userId: id,
            cardId,
          },
        },
        data: {
          isFavorite: setTo,
        },
        include: {
          card: true,
        },
      });
      res.json(userCard);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while setting the card as favorite",
      });
    }
  }

  async canUserOpenBooster(req, res) {
    const { id } = req.user;
    const user = await PrismaClient.user.findUnique({
      where: {
        id,
      },
    });
    // lastOpening is a datetime, users can open every 24hrs
    const lastOpening = user.lastOpening || new Date(0);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const canOpen = new Date(lastOpening) < twentyFourHoursAgo;
    res.json({ canOpen });
  }

  async timeUntilNextBooster(req, res) {
    const { id } = req.user;
    const user = await PrismaClient.user.findUnique({
      where: {
        id,
      },
    });
    const lastOpening = user.lastOpening || new Date(0);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const canOpen = new Date(lastOpening) < twentyFourHoursAgo;
    if (canOpen) {
      return res.json({ timeUntilNextBooster: 0 });
    }
    const timeUntilNextBooster = new Date(lastOpening) - twentyFourHoursAgo;
    res.json({ timeUntilNextBooster });
  }

  async openBooster(req, res) {
    try {
      const { id } = req.user;
      const user = await PrismaClient.user.findUnique({
        where: {
          id,
        },
      });
      const lastOpening = user.lastOpening || new Date(0);
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const canOpen = new Date(lastOpening) < twentyFourHoursAgo;
      if (!canOpen) {
        return res.status(400).json({
          error: "You can only open a booster every 24 hours",
        });
      }
      let cardsDrawn = [];
      for (let i = 0; i < 5; i++) {
        const userCards = await PrismaClient.userCard.findMany({
          where: {
            userId: id,
          },
        });
        const cardIds = userCards.map((userCard) => userCard.cardId);
        const cards = await PrismaClient.card.findMany({
          where: {
            id: {
              notIn: cardIds,
            },
          },
        });
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        cardsDrawn.push(randomCard);
        await PrismaClient.userCard.create({
          data: {
            userId: id,
            cardId: randomCard.id,
          },
        });
      }
      await PrismaClient.user.update({
        where: {
          id,
        },
        data: {
          lastOpening: new Date(),
        },
      });
      res.json(cardsDrawn);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while opening the booster",
      });
    }
  }
}

module.exports = new UserCardsController();

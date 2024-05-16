const PrismaClient = require("../config/prisma");

class TradesController {
  async getSentTrades(req, res) {
    const { id } = req.user;
    const trades = await PrismaClient.trade.findMany({
      where: {
        senderId: id,
        AND: {
          NOT: {
            status: "cancelled",
          },
          NOT: {
            status: "completed",
          },
        },
      },
    });
    res.json(trades);
  }

  async getReceivedTrades(req, res) {
    const { id } = req.user;
    const trades = await PrismaClient.trade.findMany({
      where: {
        receiverId: id,
        status: "pending",
      },
      include: {
        sender: true,
        cards: true,
      },
    });
    trades.forEach((trade) => {
      delete trade.sender.password;
      delete trade.sender.email;
      delete trade.sender.createdAt;
      delete trade.sender.updatedAt;
      delete trade.sender.lastHouseVisited;
      delete trade.sender.lastOpening;
    });
    res.json(trades);
  }

  async createTrade(req, res) {
    const { id } = req.user;
    const { receiverId, senderCards, receiverCards } = req.body;
    const trade = await PrismaClient.trade.create({
      data: {
        senderId: id,
        receiverId,
        status: "pending",
        expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });
    const senderUserCardsList = await PrismaClient.userCard.findMany({
      where: {
        userId: id,
      },
    });
    const receiverUserCardsList = await PrismaClient.userCard.findMany({
      where: {
        userId: receiverId,
      },
    });
    if (
      (!senderUserCardsList.some((card) => senderCards.includes(card.id)) &&
        senderCards.length > 0) ||
      (!receiverUserCardsList.some((card) => receiverCards.includes(card.id)) &&
        receiverCards.length > 0)
    ) {
      await PrismaClient.trade.delete({
        where: {
          id: trade.id,
        },
      });
      return res.status(400).json({ error: "Invalid cards" });
    }
    for (const cardId of senderCards) {
      await PrismaClient.tradeUserCard.create({
        data: {
          tradeId: trade.id,
          userCardId: cardId,
          isSender: true,
        },
      });
    }
    for (const cardId of receiverCards) {
      await PrismaClient.tradeUserCard.create({
        data: {
          tradeId: trade.id,
          userCardId: cardId,
          isSender: false,
        },
      });
    }
    res.json(trade);
  }

  async acceptTrade(req, res) {
    const { id } = req.user;
    const { tradeId } = req.params;
    const trade = await PrismaClient.trade.findUnique({
      where: {
        id: parseInt(tradeId),
      },
    });
    if (trade.receiverId !== id) {
      return res.status(400).json({ error: "Invalid trade" });
    }
    if (trade.expirationDate < new Date()) {
      await PrismaClient.trade.update({
        where: {
          id: parseInt(tradeId),
        },
        data: {
          status: "expired",
        },
      });
      return res.status(400).json({ error: "Trade expired" });
    }
    if (trade.status !== "pending") {
      return res.status(400).json({ error: "Invalid trade" });
    }
    await PrismaClient.trade.update({
      where: {
        id: parseInt(tradeId),
      },
      data: {
        status: "completed",
      },
    });
    const tradeUserCards = await PrismaClient.tradeUserCard.findMany({
      where: {
        tradeId: parseInt(tradeId),
      },
    });
    for (const tradeUserCard of tradeUserCards) {
      await PrismaClient.userCard.update({
        where: {
          id: tradeUserCard.userCardId,
        },
        data: {
          userId: tradeUserCard.isSender ? trade.receiverId : trade.senderId,
          isFavorite: false,
        },
      });
    }
    res.json(trade);
  }

  async cancelTrade(req, res) {
    const { id } = req.user;
    const { tradeId } = req.params;
    const trade = await PrismaClient.trade.findUnique({
      where: {
        id: parseInt(tradeId),
      },
    });
    if (trade.senderId !== id) {
      return res.status(400).json({ error: "Invalid trade" });
    }
    if (trade.expirationDate < new Date()) {
      await PrismaClient.trade.update({
        where: {
          id: parseInt(tradeId),
        },
        data: {
          status: "expired",
        },
      });
      return res.status(400).json({ error: "Trade expired" });
    }
    await PrismaClient.trade.update({
      where: {
        id: parseInt(tradeId),
      },
      data: {
        status: "cancelled",
      },
    });
    res.json(trade);
  }

  async denyTrade(req, res) {
    const { id } = req.user;
    const { tradeId } = req.params;
    const trade = await PrismaClient.trade.findUnique({
      where: {
        id: parseInt(tradeId),
      },
    });
    if (trade.receiverId !== id) {
      return res.status(400).json({ error: "Invalid trade" });
    }
    if (trade.expirationDate < new Date()) {
      await PrismaClient.trade.update({
        where: {
          id: parseInt(tradeId),
        },
        data: {
          status: "expired",
        },
      });
      return res.status(400).json({ error: "Trade expired" });
    }
    await PrismaClient.trade.update({
      where: {
        id: parseInt(tradeId),
      },
      data: {
        status: "denied",
      },
    });
    res.json(trade);
  }

  async getTradeCards(req, res) {
    const { id } = req.params;
    const tradeUserCards = await PrismaClient.tradeUserCard.findMany({
      where: {
        tradeId: parseInt(id),
      },
    });
    res.json(tradeUserCards);
  }
}

module.exports = new TradesController();

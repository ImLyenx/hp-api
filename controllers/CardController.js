import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getCards = async (req, res) => {
  prisma.card
    .findMany()
    .then((cards) => {
      res.send(cards);
    })
    .catch((error) => {
      res.json(error);
    });
};

const getCard = async (req, res) => {
  // get card by slug
  const { slug } = req.params;
  prisma.card
    .findUnique({
      where: {
        slug: slug,
      },
    })
    .then((card) => {
      res.json(card);
    })
    .catch((error) => {
      console.log(error);
      res.json(error);
    });
};

export { getCards, getCard };

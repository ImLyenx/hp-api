const express = require("express");
const AuthController = require("../controllers/AuthController");
const UsersController = require("../controllers/UsersController");
const CardsController = require("../controllers/CardsController");
const UserCardsController = require("../controllers/UserCardsController");
const TradesController = require("../controllers/TradesController");

const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

router.post("/api/login", AuthController.login);
router.get("/api/profile", authenticateToken, (req, res) => {
  const user = req.user;
  delete user.password;
  res.json(user);
});
router.get("/api/latesthouse", authenticateToken, (req, res) => {
  const user = req.user;
  res.json({ house: user.lastHouseVisited });
});
router.post(
  "/api/latesthouse",
  authenticateToken,
  (req, res, next) => {
    const user = req.user;
    const house = req.body.house;
    req.user = { id: user.id, lastHouseVisited: house };
    next();
  },
  (req, res) => {
    UsersController.update(req, res);
  }
);

router.get("/api/users", UsersController.index);
router.get("/api/users/:id", UsersController.show);
router.post("/api/users", UsersController.store);
router.delete("/api/users/:id", UsersController.delete);

router.get("/api/cards", CardsController.index);
router.get("/api/cards/:id", CardsController.show);
router.post("/api/cards", CardsController.showMultiple);

router.get("/api/usercards", authenticateToken, UserCardsController.index);
router.get("/api/usercards/:id", UserCardsController.show);
router.get("/api/users/:id/cards", UserCardsController.getUserCards);
router.post("/api/usercards", authenticateToken, UserCardsController.store);
router.post(
  "/api/usercards/favorite",
  authenticateToken,
  UserCardsController.setFavorite
);
router.get(
  "/api/canuseropenbooster",
  authenticateToken,
  UserCardsController.canUserOpenBooster
);
router.get(
  "/api/openbooster",
  authenticateToken,
  UserCardsController.openBooster
);
router.get(
  "/api/timeuntilnextbooster",
  authenticateToken,
  UserCardsController.timeUntilNextBooster
);

router.post("/api/trades", authenticateToken, TradesController.createTrade);
router.get(
  "/api/trades/sent",
  authenticateToken,
  TradesController.getSentTrades
);
router.get(
  "/api/trades/received",
  authenticateToken,
  TradesController.getReceivedTrades
);
router.get(
  "/api/trades/:tradeId/accept",
  authenticateToken,
  TradesController.acceptTrade
);
router.get(
  "/api/trades/:tradeId/cancel",
  authenticateToken,
  TradesController.cancelTrade
);
router.get(
  "/api/trades/:tradeId/deny",
  authenticateToken,
  TradesController.denyTrade
);
router.get("/api/trades/:id/cards", TradesController.getTradeCards);

module.exports = router;

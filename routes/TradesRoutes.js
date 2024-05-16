const express = require("express");

const { authenticateToken } = require("../middlewares/auth");
const TradesController = require("../controllers/TradesController");

const router = express.Router();

router.post("/", authenticateToken, TradesController.createTrade);
router.get("/sent", authenticateToken, TradesController.getSentTrades);
router.get("/received", authenticateToken, TradesController.getReceivedTrades);
router.get("/:tradeId/accept", authenticateToken, TradesController.acceptTrade);
router.get("/:tradeId/cancel", authenticateToken, TradesController.cancelTrade);
router.get("/:tradeId/deny", authenticateToken, TradesController.denyTrade);
router.get("/:id/cards", TradesController.getTradeCards);

module.exports = router;

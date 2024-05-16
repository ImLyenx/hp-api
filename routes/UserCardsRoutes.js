const express = require("express");

const { authenticateToken } = require("../middlewares/auth");
const UserCardsController = require("../controllers/UserCardsController");

const router = express.Router();

router.get("/", authenticateToken, UserCardsController.index);
router.get("/:id", UserCardsController.show);
router.post("/", authenticateToken, UserCardsController.store);
router.post("/favorite", authenticateToken, UserCardsController.setFavorite);

module.exports = router;

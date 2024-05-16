const express = require("express");

const UsersController = require("../controllers/UsersController");
const UserCardsController = require("../controllers/UserCardsController");

const router = express.Router();

router.get("/", UsersController.index);
router.get("/:id", UsersController.show);
router.post("/", UsersController.store);
router.delete("/:id", UsersController.delete);

router.get("/:id/cards", UserCardsController.getUserCards);

module.exports = router;

const express = require("express");

const CardsController = require("../controllers/CardsController");

const router = express.Router();

router.get("/", CardsController.index);
router.get("/:id", CardsController.show);
router.post("/", CardsController.showMultiple);

module.exports = router;

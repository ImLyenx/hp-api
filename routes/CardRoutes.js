import express from "express";
import { getCards, getCard } from "../controllers/CardController.js";

const router = express.Router();

router.get("/", getCards);
router.get("/:slug", getCard);

export default router;

const express = require("express");
const AuthController = require("../controllers/AuthController");
const UsersController = require("../controllers/UsersController");
const CardsController = require("../controllers/CardsController");
const UserCardsController = require("../controllers/UserCardsController");

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
router.post("/api/usercards", authenticateToken, UserCardsController.store);

router.get("/api/test", (req, res) => {
  res.json({ house: "" });
});

module.exports = router;

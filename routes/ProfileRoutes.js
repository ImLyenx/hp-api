const express = require("express");

const { authenticateToken } = require("../middlewares/auth");
const UsersController = require("../controllers/UsersController");
const UserCardsController = require("../controllers/UserCardsController");

const router = express.Router();

router.get("/profile", authenticateToken, (req, res) => {
  const user = req.user;
  delete user.password;
  res.json(user);
});
router.get("/latesthouse", authenticateToken, (req, res) => {
  const user = req.user;
  res.json({ house: user.lastHouseVisited });
});
router.post(
  "/latesthouse",
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
router.get(
  "/canopenbooster",
  authenticateToken,
  UserCardsController.canUserOpenBooster
);
router.get("/openbooster", authenticateToken, UserCardsController.openBooster);
router.get(
  "/timeuntilnextbooster",
  authenticateToken,
  UserCardsController.timeUntilNextBooster
);

module.exports = router;

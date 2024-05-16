const express = require("express");

const UsersRoutes = require("./routes/UsersRoutes");
const AuthRoutes = require("./routes/AuthRoutes");
const ProfileRoutes = require("./routes/ProfileRoutes");
const TradesRoutes = require("./routes/TradesRoutes");
const CardsRoutes = require("./routes/CardsRoutes");
const UserCardsRoutes = require("./routes/UserCardsRoutes");

const router = express.Router();

router.use("/users", UsersRoutes);
router.use("/auth", AuthRoutes);
router.use("/me", ProfileRoutes);
router.use("/trades", TradesRoutes);
router.use("/cards", CardsRoutes);
router.use("/usercards", UserCardsRoutes);

module.exports = router;

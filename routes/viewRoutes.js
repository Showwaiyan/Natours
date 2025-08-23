const express = require("express");
const viewController = require("./../controllers/viewController");
const authContorller = require("./../controllers/authController");
const bookingContorller = require("./../controllers/bookingController");

router = express.Router();

router.get(
  "/",
  bookingContorller.createBookingCheckout,
  authContorller.isLoggedIn,
  viewController.getOverview,
);
router.get("/tour/:slug", authContorller.isLoggedIn, viewController.getTour);
router.get("/login", authContorller.isLoggedIn, viewController.getLogin);
router.get("/me", authContorller.protect, viewController.getAccount);

module.exports = router;

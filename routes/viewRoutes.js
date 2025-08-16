const express = require("express");
const viewController = require("./../controllers/viewController");
const authContorller = require("./../controllers/authController");

router = express.Router();

router.get("/", authContorller.isLoggedIn, viewController.getOverview);
router.get("/tour/:slug", authContorller.isLoggedIn, viewController.getTour);
router.get("/login", authContorller.isLoggedIn, viewController.getLogin);
router.get("/me", authContorller.protect, viewController.getAccount);

module.exports = router;

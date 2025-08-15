const express = require("express");
const viewController = require("./../controllers/viewController");
const authContorller = require("./../controllers/authController");

router = express.Router();

router.use(authContorller.isLoggedIn);

router.get("/", viewController.getOverview);
router.get("/tour/:slug", viewController.getTour);
router.get("/login",viewController.getLogin)

module.exports = router;

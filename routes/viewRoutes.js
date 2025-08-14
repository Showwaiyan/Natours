const express = require("express");
const viewController = require("./../controllers/viewController");

router = express.Router();

router.get("/", viewController.getHome);
router.get("/overview", viewController.getOverview);
router.get("/tour/:slug", viewController.getTour);
router.get("/login",viewController.getLogin)

module.exports = router;

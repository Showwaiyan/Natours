const express = require("express");
const tourController = require("./../controllers/tourController");

const router = express.Router();

// router.param("id", tourController.checkID);
router.route("/top-5-cheap").get(tourController.getTopFiveCheapTours, tourController.getAllTours);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);
router.route("/tours-stats").get(tourController.getToursStats);

router.route("/").get(tourController.getAllTours).post(tourController.createTour);

router.route("/:id").get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;

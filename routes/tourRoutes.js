const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");

const router = express.Router();

// router.param("id", tourController.checkID);
router
  .route("/top-5-cheap")
  .get(tourController.getTopFiveCheapTours, tourController.getAllTours);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);
router.route("/tours-stats").get(tourController.getToursStats);

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.protect, authController.restrict("admin","lead-guide"),tourController.deleteTour);

module.exports = router;

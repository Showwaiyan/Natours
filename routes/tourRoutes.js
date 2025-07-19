const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

// router.param("id", tourController.checkID);
router
  .route("/top-5-cheap")
  .get(tourController.getTopFiveCheapTours, tourController.getAllTours);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);
router.route("/tours-stats").get(tourController.getToursStats);

router.route("/tours-within/:distance/center/:latlng/unit/:unit").get(tourController.getTourWithin)

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrict("admin", "lead-guide", "guide"),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrict("admin", "lead-guide"),
    tourController.deleteTour,
  );

// Review router on tour
router.use("/:tourId/reviews", reviewRouter);

module.exports = router;

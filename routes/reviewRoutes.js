const express = require("express");
const authController = require(".././controllers/authController");
const reviewController = require(".././controllers/reviewController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrict("user"),
    reviewController.setTourAndUserId,
    reviewController.createReview,
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrict("user", "admin"),
    reviewController.updateReview,
  )
  .delete(
    authController.restrict("user", "admin"),
    reviewController.deleteReview,
  );

module.exports = router;

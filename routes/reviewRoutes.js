const express = require("express");
const authController = require(".././controllers/authController");
const reviewController = require(".././controllers/reviewController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    authController.protect,
    reviewController.getAllReviews,
  )
  .post(
    authController.protect,
    authController.restrict("user"),
    reviewController.setTourAndUserId,
    reviewController.createReview,
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview);

module.exports = router;

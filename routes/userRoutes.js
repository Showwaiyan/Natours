const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.logIn);
router.post("/forgotpassword", authController.forgotPassword);
router.patch("/resetpassword/:token", authController.resetPassword);
router.patch(
  "/updatepassword",
  authController.protect,
  authController.updatePassword,
);

router.patch("/updateme", authController.protect, userController.updateMe);
router.delete("/deleteme", authController.protect, userController.deleteMe);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.protect,
    authController.restrict("admin"),
    userController.deleteUser,
  );

module.exports = router;

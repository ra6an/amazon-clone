const express = require("express");
const authController = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

// router.route("/").get(authController.getUser);

router.route("/").get(authMiddleware, authController.getUser);
router.route("/signup").post(authController.signUp);
router.route("/signin").post(authController.signIn);
router.route("/tokenIsValid").post(authController.checkTokenValidity);

module.exports = router;

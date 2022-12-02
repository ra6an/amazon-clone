const express = require("express");
const auth = require("../middlewares/auth-middleware");
const userController = require("../controllers/user-controller");

const router = express.Router();

router.route("/add-to-cart").post(auth, userController.addToCart);
router
  .route("/remove-from-cart/:productId")
  .delete(auth, userController.removeFromCart);
router.route("/save-user-address").post(auth, userController.saveUserAddress);
router.route("/order").post(auth, userController.order);
router.route("/orders/me").get(auth, userController.getMyOrders);

module.exports = router;

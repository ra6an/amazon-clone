const express = require("express");
const adminController = require("../controllers/admin-controller");
const adminMiddleware = require("../middlewares/admin-middleware");

const router = express.Router();

// GET
router.route("/get-products").get(adminMiddleware, adminController.getProducts);
router.route("/get-orders").get(adminMiddleware, adminController.getOrders);
router.route("/analytics").get(adminMiddleware, adminController.analytics);
// POST
router.route("/add-product").post(adminMiddleware, adminController.addProduct);
router
  .route("/change-order-status")
  .post(adminMiddleware, adminController.changeOrderStatus);
// DELETE
router
  .route("/delete-product")
  .delete(adminMiddleware, adminController.deleteProduct);

module.exports = router;

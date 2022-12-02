const express = require("express");
const auth = require("../middlewares/auth-middleware");
const productController = require("../controllers/product-controller");

const router = express.Router();

router.route("/deal-of-day").get(auth, productController.dealOfDay);
router.route("/products").get(auth, productController.getProducts);
router.route("/rate-product").post(auth, productController.rateProduct);
router
  .route("/products/search/:name")
  .get(auth, productController.getSearcherProducts);

module.exports = router;

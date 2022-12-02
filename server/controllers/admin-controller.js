//
const catchAsync = require("../utils/catch-async");
const { Product } = require("../models/productModel");
const Order = require("../models/orderModel");

const fetchCategoryWiseProduct = async (category) => {
  let earnings = 0;
  let categoryOrders = await Order.find({
    "products.product.category": category,
  });

  categoryOrders.forEach((order) => {
    order.products.forEach((product) => {
      earnings += product.quantity * product.product.price;
    });
  });

  return earnings;
};

exports.addProduct = catchAsync(async (req, res, next) => {
  const { name, description, images, quantity, price, category } = req.body;

  let product = new Product({
    name,
    description,
    images,
    quantity,
    price,
    category,
  });

  product = await product.save();
  res.status(200).json(product);
});

exports.getProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json(products);
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const productId = req.body.id;

  await Product.findByIdAndDelete(productId);

  res.status(200).json("You delete product successfully!");
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json(orders);
});

exports.changeOrderStatus = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  let order = await Order.findById(id);

  if (order.status < 3) {
    order.status += 1;
  }

  order = await order.save();

  res.status(200).json(order);
});

exports.analytics = catchAsync(async (req, res, next) => {
  const orders = await Order.find();
  let totalEarnings = 0;

  orders.forEach((order) => {
    order.products.forEach((product) => {
      totalEarnings += product.quantity * product.product.price;
    });
  });

  // CATEGORY WISE ORDER FETCHING
  const mobileEarnings = await fetchCategoryWiseProduct("Mobiles");
  const essentialEarnings = await fetchCategoryWiseProduct("Essentials");
  const applianceEarnings = await fetchCategoryWiseProduct("Appliances");
  const booksEarnings = await fetchCategoryWiseProduct("Books");
  const fashionEarnings = await fetchCategoryWiseProduct("Fashion");

  const earnings = {
    totalEarnings,
    mobileEarnings,
    essentialEarnings,
    booksEarnings,
    fashionEarnings,
    applianceEarnings,
  };

  res.status(200).json(earnings);
});

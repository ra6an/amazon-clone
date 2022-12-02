//
const catchAsync = require("../utils/catch-async");
const { Product } = require("../models/productModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");

exports.addToCart = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  const product = await Product.findById(id);
  let user = await User.findById(req.user);

  if (user.cart.length > 0) {
    let isInCart = false;

    user.cart.forEach((prod) => {
      if (prod.product._id.equals(product._id)) {
        prod.quantity += 1;
        isInCart = true;
      }
    });

    if (!isInCart) {
      console.log("stas ovdje");
      user.cart.push({ product, quantity: 1 });
    }
  }

  if (user.cart.length === 0) {
    user.cart.push({ product, quantity: 1 });
  }

  user = await user.save();

  res.status(200).json(user);
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  let user = await User.findById(req.user);

  const separatedProduct = user.cart.filter((p) =>
    p.product._id.equals(product._id)
  );

  if (separatedProduct[0].quantity === 1) {
    user.cart = user.cart.filter((p) => !p.product._id.equals(product._id));
  }

  console.log(separatedProduct[0].quantity);
  console.log(separatedProduct[0].quantity > 1);

  if (separatedProduct[0].quantity > 1) {
    user.cart.forEach((prod) => {
      if (prod.product._id.equals(product._id)) {
        prod.quantity = prod.quantity - 1;
      }
    });
  }

  user = await user.save();

  res.status(200).json(user);
});

exports.saveUserAddress = catchAsync(async (req, res, next) => {
  const { address } = req.body;

  let user = await User.findById(req.user);

  user.address = address;

  user = await user.save();

  res.status(200).json(user);
});

exports.order = catchAsync(async (req, res, next) => {
  const { cart, totalPrice, address } = req.body;

  let products = [];

  for (let i = 0; i < cart.length; i++) {
    let product = await Product.findById(cart[i].product._id);
    if (product.quantity >= cart[i].quantity) {
      product.quantity -= cart[i].quantity;
      products.push({ product, quantity: cart[i].quantity });
      await product.save();
    } else {
      return res.status(400).json({ msg: `${product.name} is out of stock!` });
    }
  }

  let user = await User.findById(req.user);
  user.cart = [];
  user = await user.save();

  let order = new Order({
    products,
    totalPrice,
    address,
    userId: req.user,
    orderedAt: new Date().getTime(),
  });

  order = await order.save();

  res.status(200).json(order);
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ userId: req.user });
  res.status(200).json(orders);
});

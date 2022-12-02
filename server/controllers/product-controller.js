//
const catchAsync = require("../utils/catch-async");
const { Product } = require("../models/productModel");
// const ratingSchema = require("../models/rating-structure");

exports.getProducts = catchAsync(async (req, res, next) => {
  const category = req.query.category;

  const products = await Product.find({ category });

  res.status(200).json(products);
});

exports.getSearcherProducts = catchAsync(async (req, res, next) => {
  const name = req.params.name;

  const products = await Product.find({
    name: { $regex: name, $options: "i" },
  });

  res.status(200).json(products);
});

exports.rateProduct = catchAsync(async (req, res, next) => {
  const { id, rating } = req.body;

  let product = await Product.findById(id);

  product.ratings = product.ratings.filter(
    (rating) => rating.userId !== req.user
  );

  const ratingSchema = {
    userId: req.user,
    rating,
  };

  product.ratings.push(ratingSchema);
  product = await product.save();

  res.status(200).json(product);
});

exports.dealOfDay = catchAsync(async (req, res, next) => {
  let products = await Product.find();

  products = products.sort((a, b) => {
    let aSum = 0;
    let bSum = 0;

    for (let i = 0; i < a.ratings.length; i++) {
      aSum += a.ratings[i].rating;
    }

    for (let i = 0; i < b.ratings.length; i++) {
      aSum += b.ratings[i].rating;
    }

    return aSum < bSum ? 1 : -1;
  });

  res.json(products[0]);
});

// PACKAGES
const jwt = require("jsonwebtoken");

const TOKEN_SECRET = process.env.TOKEN_SECRET;

// OUR MODULES
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");
const User = require("../models/userModel");

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user);

  res.status(200).json({
    ...user._doc,
    token: req.token,
  });
});

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    // return next(new AppError("User with that email already exist!", 400));
    return res
      .status(400)
      .json({ msg: "User with same email already exists!" });
  }

  let newUser = new User({ email, password, name });

  newUser = await newUser.save();

  res.status(200).json({
    status: "success",
    user: newUser,
  });
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide valid email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    // return next(new AppError("You entered wrong email!", 400));
    return res
      .status(400)
      .json({ msg: "User with this email does not exist!" });
  }

  const compare = await user.checkPassword(password, user.password);

  if (!compare) {
    // return next(new AppError("You entered wrong password!", 400));
    return res.status(400).json({ msg: "Incorrect password." });
  }

  const token = jwt.sign({ id: user._id }, TOKEN_SECRET);
  const signedUser = await User.findOne({ email });

  // console.log(signedUser._doc);
  // console.log(token);

  res.status(200).json({ ...signedUser._doc, token });
});

exports.checkTokenValidity = catchAsync(async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.json(false);
  }

  const verified = jwt.verify(token, TOKEN_SECRET);

  if (!verified) {
    return res.json(false);
  }

  const user = await User.findById(verified.id);

  if (!user) {
    return res.json(false);
  }

  res.json(true);
});

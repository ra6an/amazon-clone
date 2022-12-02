const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catch-async");
const User = require("../models/userModel");
// const AppError = require("../utils/app-error");

const TOKEN_SECRET = process.env.TOKEN_SECRET;

const checkIfAdmin = catchAsync(async (req, res, next) => {
  const token = req.headers["x-auth-token"];

  if (!token) {
    return res.status(401).json({ msg: "No auth token, access denied!" });
  }

  const verification = jwt.verify(token, TOKEN_SECRET);

  if (!verification) {
    return res
      .status(401)
      .json({ msg: "Token verification failed, authorization denied!" });
  }

  const user = await User.findById(verification.id);

  if (user.type === "user" || user.type === "seller") {
    return res
      .status(401)
      .json({ msg: "You are not an admin, access denied!" });
  }

  req.user = verification.id;
  req.token = token;

  next();
});

module.exports = checkIfAdmin;

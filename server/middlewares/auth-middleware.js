//
const jwt = require("jsonwebtoken");
// const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");

const TOKEN_SECRET = process.env.TOKEN_SECRET;

const auth = catchAsync(async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No auth token, access denied!" });
  }

  const verified = jwt.verify(token, TOKEN_SECRET);

  if (!verified) {
    return res
      .status(401)
      .json({ msg: "Token verification failed, authorization denied!" });
  }

  req.user = verified.id;
  req.token = token;

  next();
});

module.exports = auth;

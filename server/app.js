// PACKAGES
const express = require("express");

// OUR MODULES
const authRouter = require("./routes/auth-router");
const adminRouter = require("./routes/admin-router");
const productRouter = require("./routes/product-router");
const userRouter = require("./routes/user-router");
const globalErrorHandler = require("./controllers/error-controller");
const morgan = require("morgan");

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ROUTES
app.use("/api/v1/product", productRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);

// ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;

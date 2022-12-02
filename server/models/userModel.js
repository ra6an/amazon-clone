const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const { productSchema } = require("./productModel");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address!",
    },
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password need to contain at least 8 characters!"],
    select: false,
  },
  address: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "user",
    enum: ["user", "admin", "moderator"],
  },
  cart: [
    {
      product: productSchema,
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 12);
  next();
});

userSchema.methods.checkPassword = async function (
  enteredPassword,
  hashedPassword
) {
  return await bcryptjs.compare(enteredPassword, hashedPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

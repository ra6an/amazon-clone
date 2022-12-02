const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

let DB, PASSWORD;

const ENV = process.env.NODE_ENV;

if (ENV === "development") {
  PASSWORD = process.env.PASSWORD_DB;
  DB = process.env.MONGO_DB.replace("<PASSWORD>", PASSWORD);
} else {
  // dodati pass i db za production
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Starting server on port: ${PORT}, ENV: ${ENV}`);
});

mongoose
  .connect(DB)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log("Something went wrong!");
    console.log(err);
  });

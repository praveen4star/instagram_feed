const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const options = {
  useNewUrlParser: true
};

mongoose
  .connect(MONGO_URI, options)
  .then(() => console.log("db is now connected so proceed your routes"))
  .catch((err) => console.log(err.message));

module.exports = {db : mongoose};
const mongoose = require("mongoose");
const connectDb = (uri) => {
  try {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connect database successfully!");
  } catch (error) {
    throw new Error(`Connect database failure!`);
  }
};

module.exports = connectDb;

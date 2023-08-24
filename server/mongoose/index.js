require("dotenv").config();

const uri = process.env.MONGODB;
const mongoose = require("mongoose");

exports.connect = () => {
  mongoose
    .connect(
      "mongodb+srv://harshul:Mongodb12345@cluster0.n6vhnhg.mongodb.net/auth"
    )
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};

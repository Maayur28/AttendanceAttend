const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
require("dotenv").config();

const url = process.env.URL;
const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
const attendanceSchema = mongoose.Schema({
  date: { type: String },
  uid: { type: String },
  status:{type:String},
  advance: { type: Number },
  remarks: { type: String },
});

const InfoSchema = mongoose.Schema({
  id: { type: String, required: [true, "id is required"] },
  name: { type: String, required: [true, "Name is required"] },
  salary: { type: Number, required: [true, "Salary is required"] },
  startDate: { type: String },
  attendance: [attendanceSchema],
});
const dataSchema = mongoose.Schema({
  userid: { type: String, required: [true, "userid is required"] },
  data: [InfoSchema],
});

let connection = {};
connection.getAttendanceConnection = async () => {
  try {
    let dbConnection = await mongoose.connect(url, options);
    let model = dbConnection.model("attend", dataSchema);
    return model;
  } catch (error) {
    let err = new Error(
      "Could not establish connection with Wishlist database"
    );
    err.status = 500;
    throw err;
  }
};
module.exports = connection;

const validator = require("../utilities/validate");
const model = require("../models/user");
const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");
let userService = {};

userService.addEmp = async (data) => {
  return await model.addEmp(data);
  // else
  // {
  //   let err = new Error();
  //   err.status = 400;
  //   err.message = "Items not found,Please check the items and try again";
  //   throw err;
  // }
};
userService.updateEmp = async (data) => {
  return await model.updateEmp(data);
  // else
  // {
  //   let err = new Error();
  //   err.status = 400;
  //   err.message = "Items not found,Please check the items and try again";
  //   throw err;
  // }
};
userService.updateEmpId = async (data) => {
  return await model.updateEmpId(data);
  // else
  // {
  //   let err = new Error();
  //   err.status = 400;
  //   err.message = "Items not found,Please check the items and try again";
  //   throw err;
  // }
};
userService.paid = async (data) => {
  return await model.paid(data);
  // else
  // {
  //   let err = new Error();
  //   err.status = 400;
  //   err.message = "Items not found,Please check the items and try again";
  //   throw err;
  // }
};

userService.removeWishlist = async (obj) => {
  if (validator.toggleWishlist(obj)) return await model.removeWishlist(obj);
  else {
    let err = new Error();
    err.status = 400;
    err.message = "Items not found,Please check the items and try again";
    throw err;
  }
};
userService.getAttendance = async (userid) => {
  if (validator.getAttendance(userid)) {
    let data = await model.getAttendance(userid);
    data.forEach((value) => {
      if (value.attendance.length > 0) {
        current = new Date(value.attendance[0].date);
        let today = new Date(new Date().toISOString().slice(0, 10));
        while (current.getTime() < today.getTime()) {
          current.setDate(current.getDate() + 1);
          value.attendance.unshift({
            date: current.toISOString().slice(0, 10),
            uid: uuidv4(),
          });
        }
      } else {
        current = new Date(value.startDate);
        let today = new Date(new Date().toISOString().slice(0, 10));
        while (current.getTime() <= today.getTime()) {
          value.attendance.unshift({
            date: current.toISOString().slice(0, 10),
            uid: uuidv4(),
          });
          current.setDate(current.getDate() + 1);
        }
      }
    });
    return await model.convertIt(data, userid);
  }
};
module.exports = userService;

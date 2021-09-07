const dbModel = require("../utilities/connection");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
let userModel = {};

userModel.toggleProduct = async (data) => {
  let model = await dbModel.getWishlistConnection();
  let checkempty = await model.findOne({ userid: data.userid });
  if (!checkempty) {
    let obj = {};
    obj.userid = data.userid;
    delete data.userid;
    obj.wishlistItem = [data];
    let addWish = await model.create(obj);
    if (addWish) {
      return true;
    } else {
      let err = new Error();
      err.status = 500;
      err.message =
        "Sorry! Server is busy,Please try adding to wishlist after sometime";
      throw err;
    }
  } else {
    let getproductList = await model.findOne({
      userid: data.userid,
      "wishlistItem._id": data._id,
    });
    if (!getproductList) {
      let uid = data.userid;
      delete data.userid;
      let pushitem = await model.updateOne(
        { userid: uid },
        { $push: { wishlistItem: data } }
      );
      if (pushitem.nModified > 0) return true;
      else {
        let err = new Error();
        err.status = 500;
        err.message =
          "Sorry! Server is busy,Please try adding to wishlist after sometime";
        throw err;
      }
    } else {
      let removeWish = await model.updateOne(
        { userid: data.userid },
        { $pull: { wishlistItem: { _id: data._id } } }
      );
      if (removeWish.nModified === 1) return false;
      else {
        let err = new Error();
        err.status = 500;
        err.message =
          "Sorry! Server is busy,Please try removing from wishlist after sometime";
        throw err;
      }
    }
  }
};
userModel.removeWishlist = async (data) => {
  let model = await dbModel.getWishlistConnection();
  let removeWish = await model.updateOne(
    { userid: data.userid },
    { $pull: { wishlistItem: { _id: data._id } } }
  );
  if (removeWish.nModified == 1) {
    let wishdata = await model.findOne(
      { userid: data.userid },
      { wishlistItem: 1, _id: 0 }
    );
    return wishdata.wishlistItem;
  } else {
    let err = new Error();
    err.status = 500;
    err.message =
      "Sorry! Server is busy,Please try removing from wishlist after sometime";
    throw err;
  }
};
userModel.addEmp = async (emp) => {
  let model = await dbModel.getAttendanceConnection();
  let getemp = await model.findOne({ userid: emp.userid });
  if (!getemp) {
    let obj = {};
    obj.userid = emp.userid;
    delete emp.userid;
    obj.data = [];
    let addorder = await model.create(obj);
    if (addorder) {
      let id = obj.userid;
      let att = emp.data.attendance;
      delete emp.attendance;
      emp.data.attendance = [];
      emp.data.id = crypto.randomBytes(16).toString("hex");
      let pushitem = await model.updateOne(
        { userid: id },
        { $push: { data: emp.data } }
      );
      if (pushitem.nModified > 0) {
        let getData = await model.findOne({ userid: id }, { data: 1 });
        return getData;
      } else {
        let err = new Error();
        err.status = 500;
        err.message = "Sorry! Server is busy,Please try adding after sometime";
        throw err;
      }
    } else {
      let err = new Error();
      err.status = 500;
      err.message = "Sorry! Server is busy,Please try adding after sometime";
      throw err;
    }
  } else {
    let id = emp.userid;
    delete emp.userid;
    let att = emp.data.attendance;
    delete emp.attendance;
    emp.data.attendance = [];
    emp.data.id = crypto.randomBytes(16).toString("hex");
    let pushitem = await model.updateOne(
      { userid: id },
      { $push: { data: emp.data } }
    );
    if (pushitem.nModified > 0) {
      let getData = await model.findOne({ userid: id }, { data: 1 });
      return getData;
    } else {
      let err = new Error();
      err.status = 500;
      err.message = "Sorry! Server is busy,Please try adding after sometime";
      throw err;
    }
  }
};
userModel.updateEmp = async (data) => {
  let model = await dbModel.getAttendanceConnection();
  for (const value of data.data) {
    let adSet = await model.updateOne(
      { userid: data.userid, "data.id": value.id },
      { $set: { "data.$.attendance": value.attendance } }
    );
  }
  let getAtten = await model.findOne(
    { userid: data.userid },
    { data: 1, _id: 0 }
  );
  return getAtten;
};
userModel.updateEmpId = async (data) => {
  let model = await dbModel.getAttendanceConnection();
  let adSet = await model.updateOne(
    { userid: data.userid, "data.id": data.id },
    { $set: { "data.$.attendance": data.data } }
  );
  let getAtten = await model.findOne(
    { userid: data.userid },
    { data: 1, _id: 0 }
  );
  return getAtten;
};
userModel.paid = async (data) => {
  let model = await dbModel.getAttendanceConnection();
  let today = new Date(new Date().toISOString().slice(0, 10));
  today.setDate(today.getDate() + 1);
  today = String(today.toISOString().slice(0, 10));
  let adSet = await model.updateOne(
    { userid: data.userid, "data.id": data.id },
    { $set: { "data.$.startDate": today } }
  );
  await model.updateOne(
    { userid: data.userid, "data.id": data.id },
    { $set: { "data.$.attendance": [] } }
  );
  let getAtten = await model.findOne(
    { userid: data.userid },
    { data: 1, _id: 0 }
  );
  return getAtten;
};
userModel.getAttendance = async (id) => {
  let model = await dbModel.getAttendanceConnection();
  let getAttendance = await model.findOne({ userid: id }, { data: 1, _id: 0 });
  if (!getAttendance) {
    let obj = {};
    obj.userid = id;
    obj.data = [];
    await model.create(obj);
    let findData = await model.findOne({ userid: id });
    if (findData) {
      findData.data.forEach((val) => {
        let count = 0;
        if (val.attendance.length) {
          val.attendance.forEach((value) => {
            if (value.date == new Date().toISOString().slice(0, 10)) count = 1;
          });
          if (count == 0)
            val.attendance.push({
              date: new Date().toISOString().slice(0, 10),
            });
          count = 0;
        } else {
          val.attendance.push({ date: new Date().toISOString().slice(0, 10) });
        }
      });
      return findData.data;
    } else {
      let err = new Error();
      err.status = 500;
      err.message =
        "Sorry! Server is busy,Please try adding to wishlist after sometime";
      throw err;
    }
  } else {
    return getAttendance.data;
  }
};
userModel.convertIt = async (data, id) => {
  let model = await dbModel.getAttendanceConnection();
  for (const value of data) {
    let adSet = await model.updateOne(
      { userid: id, "data.id": value.id },
      { $set: { "data.$.attendance": value.attendance } }
    );
  }
  let getAtten = await model.findOne({ userid: id }, { data: 1, _id: 0 });
  return getAtten.data;
};
module.exports = userModel;

const express = require("express");
const routes = express.Router();
const service = require("../services/user");
const auth = require("../utilities/auth");

routes.post("/addemp", async (req, res, next) => {
  try {
    let getEmp = await service.addEmp(req.body);
    res.json({ data: getEmp.data }).status(200);
  } catch (error) {
    next(error);
  }
});
routes.post("/updateemp", async (req, res, next) => {
  try {
    let getEmp = await service.updateEmp(req.body);
    res.json({ data: getEmp.data }).status(200);
  } catch (error) {
    next(error);
  }
});
routes.post("/updateempid", async (req, res, next) => {
  try {
    let getEmp = await service.updateEmpId(req.body);
    res.json({ data: getEmp.data }).status(200);
  } catch (error) {
    next(error);
  }
});
routes.post("/paid", async (req, res, next) => {
  try {
    let getEmp = await service.paid(req.body);
    res.json({ data: getEmp.data }).status(200);
  } catch (error) {
    next(error);
  }
});
routes.delete("/removewishlist", auth, async (req, res, next) => {
  req.body.userid = req.user.userid;
  try {
    let getWishlist = await service.removeWishlist(req.body);
    res.json({ wish: getWishlist }).status(200);
  } catch (error) {
    next(error);
  }
});
routes.get("/getattendance", async (req, res, next) => {
  try {
    let data = await service.getAttendance(req.headers.userid);
    res.send({ data }).status(200);
  } catch (error) {
    next(error);
  }
});
routes.get("/", async (req, res, next) => {
  try {
    res.json("Ping Successful").status(200);
  } catch (error) {
    next(error);
  }
});
module.exports = routes;

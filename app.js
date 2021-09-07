const express = require("express");
const cors = require("cors");
const requestLogger = require("./utilities/requestLogger");
const routing = require("./routes/routing");
const errorLogger = require("./utilities/errorLogger");
const helmet=require('helmet');
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(requestLogger);
app.use("/", routing);
app.use(errorLogger);

app.listen(process.env.PORT||port, (err) => {
  if (!err) console.log(`Attendance Server started at port ${process.env.PORT}`);
  else console.log("Error in attendance server setup");
});

module.exports=app;
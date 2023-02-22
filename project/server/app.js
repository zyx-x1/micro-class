const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const wsPort = 8181;
const router = require("./router");
const { db } = require("./db/db.js");
const { server } = require("./ws");
const uploader = require("express-fileupload")
// 允许请求头中所有字段的传输
app.all("*", (req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(uploader())
app.use("/", router);
app.use("/", express.static('resource'))


server.listen(wsPort, function () {
  console.log("WebScoket is running at ws://localhost:8181");
});

const dealTime = () => {
  let result, hour, minute, second;
  hour = new Date().getHours().toString().padStart(2, "0");
  minute = new Date().getMinutes().toString().padStart(2, "0");
  second = new Date().getSeconds().toString().padStart(2, "0");
  result = `${hour}:${minute}:${second}`;
  return result;
};
app.listen(port, () => {
  console.log(`Server is running at ${dealTime()}`);
});

const http = require("http");
const express = require("express");
const app = express();
const WebSocketServer = require("ws").Server;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
wss.on("connection", function (ws) {
  ws.on("message", function (message) {
    console.log(message);
    wss.clients.forEach(function (ws) {
      ws.send(message);
    });
  });
  ws.on("close", function () {
    console.log("连接关闭");
  });
});
exports.server = server;
exports.wss = wss;

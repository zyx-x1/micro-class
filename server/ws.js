const http = require("http");
const express = require("express");
const app = express();
const WebSocketServer = require("ws").Server;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    wss.clients.forEach(function (ws) {
      ws.send(message);
    });
  });
  ws.on("close", () => {
    console.log("WebSocket连接关闭");
  });
});
exports.server = server;
exports.wss = wss;

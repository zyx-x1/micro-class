const express = require("express");
const router = express.Router();
const api = require("./apis/index");

router.get("/load", (req, res, next) => {
  api.loader(req, res, next);
});
router.get("/login/token/check", (req, res, next) => {
  api.checkToken(req, res, next);
});
router.get("/user/username/update", (req, res, next) => {
  api.updateUsername(req, res, next);
});
router.get("/leave", (req, res, next) => {
  api.unloader(req, res, next);
});

router.get("/login", (req, res, next) => {
  api.login(req, res, next);
});

router.get("/register", (req, res, next) => {
  api.register(req, res, next);
});

router.get("/resetpwd", (req, res, next) => {
  api.resetpwd(req, res, next);
});

router.get("/register/mail/getcode", (req, res, next) => {
  api.rEmailCode(req, res, next);
});

router.get("/email", (req, res, next) => {
  api.email(req, res, next);
});

router.get("/user/info/search", (req, res, next) => {
  api.getUserInfoForName(req, res, next);
});

router.get("/class/get", (req, res, next) => {
  api.loadClass(req, res, next);
});
module.exports = router;

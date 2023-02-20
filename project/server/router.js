const express = require("express");
const router = express.Router();
const api = require("./apis/index");
const userApi = require("./apis/user");
const classApi = require("./apis/class");
const commentApi = require("./apis/comment");
// 用户
router.get("/load", (req, res, next) => {
  userApi.loader(req, res, next);
});
router.get("/login/token/check", (req, res, next) => {
  userApi.checkToken(req, res, next);
});
router.get("/user/username/update", (req, res, next) => {
  userApi.updateUsername(req, res, next);
});
router.get("/leave", (req, res, next) => {
  userApi.unloader(req, res, next);
});

router.get("/login", (req, res, next) => {
  userApi.login(req, res, next);
});

router.get("/register", (req, res, next) => {
  userApi.register(req, res, next);
});

router.get("/resetpwd", (req, res, next) => {
  userApi.resetpwd(req, res, next);
});

router.get("/register/mail/getcode", (req, res, next) => {
  userApi.rEmailCode(req, res, next);
});

router.get("/email", (req, res, next) => {
  userApi.email(req, res, next);
});

router.get("/user/info/search", (req, res, next) => {
  userApi.getUserInfoForName(req, res, next);
});
// 微课
router.get("/class/get", (req, res, next) => {
  classApi.loadClass(req, res, next);
});
router.get("/class/play/count", (req, res, next) => {
  classApi.updateClassPlayCount(req, res, next);
});
router.get("/class/like_collection", (req, res, next) => {
  classApi.getClassLikeCollection(req, res, next);
});
router.get("/class/like", (req, res, next) => {
  classApi.likeClass(req, res, next);
});
router.get("/class/collection", (req, res, next) => {
  classApi.collectionClass(req, res, next);
});
router.get("/class/collection/get", (req, res, next) => {
  classApi.getCollections(req, res, next);
});
router.get("/class/search", (req, res, next) => {
  classApi.searchClass(req, res, next);
});

router.get("/class/associated/get", (req, res, next) => {
  classApi.getAssociatedClass(req, res, next);
});

router.get("/class/commend", (req, res, next) => {
  classApi.getCommendClass(req, res, next);
});
// 评论
router.get("/comment/get", (req, res, next) => {
  commentApi.getComment(req, res, next);
});
router.get("/comment/set", (req, res, next) => {
  commentApi.setComment(req, res, next);
});
router.get("/comment/delete", (req, res, next) => {
  commentApi.deleteComment(req, res, next);
});
module.exports = router;

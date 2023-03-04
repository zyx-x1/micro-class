const express = require("express");
const router = express.Router();
const api = require("./apis/index");
const userApi = require("./apis/user");
const classApi = require("./apis/class");
const commentApi = require("./apis/comment");
const messageApi = require("./apis/message");
const uploadApi = require("./apis/upload");
const adminApi = require("./apis/admin");
const configApi = require("./apis/config");

//管理

router.get("/admin/login", (req, res, next) => {
  adminApi.adminLogin(req, res, next);
});

router.get("/admin/token/check", (req, res, next) => {
  adminApi.checkToken(req, res, next);
});
router.post("/visitor/send", (req, res, next) => {
  adminApi.setVisitor(req, res, next);
});

router.get("/visitor/get", (req, res, next) => {
  adminApi.getVisitor(req, res, next);
});

router.get("/admin/userinfo/get", (req, res, next) => {
  adminApi.getUserInfo(req, res, next);
});

router.get("/admin/audit/get", (req, res, next) => {
  adminApi.getAudit(req, res, next);
});

router.get("/admin/audit/submit", (req, res, next) => {
  adminApi.submitAudit(req, res, next);
});

router.get("/admin/config/get", (req, res, next) => {
  adminApi.getConfig(req, res, next);
});

router.post("/admin/config/update", (req, res, next) => {
  adminApi.updateConfig(req, res, next);
});

router.get("/admin/downloadrecord/get", (req, res, next) => {
  adminApi.getDownloadRecord(req, res, next);
});

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

router.get("/forget/submit", (req, res, next) => {
  userApi.resetpwd(req, res, next);
});

router.get("/register/mail/getcode", (req, res, next) => {
  userApi.rEmailCode(req, res, next);
});

router.get("/reset/email", (req, res, next) => {
  userApi.resetEmail(req, res, next);
});

router.get("/user/info/search", (req, res, next) => {
  userApi.getUserInfoForName(req, res, next);
});

router.post("/user/avatar/update", (req, res, next) => {
  userApi.updateUserAvatar(req, res, next);
});

router.get("/user/avatar/get", (req, res, next) => {
  userApi.getAvatar(req, res, next);
});

router.get("/user/signin/retroactive", (req, res, next) => {
  userApi.userRetroactive(req, res, next);
});

router.get("/user/signin/get", (req, res, next) => {
  userApi.getUserSignin(req, res, next);
});

router.get("/user/credits/detail/get", (req, res, next) => {
  userApi.getUserCreditsDetails(req, res, next);
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
router.get("/class/subjects/get", (req, res, next) => {
  classApi.getSubjects(req, res, next);
});

router.get("/class/subject/filter", (req, res, next) => {
  classApi.filterSubjectClass(req, res, next);
});

router.get("/class/new/get", (req, res, next) => {
  classApi.getNewClass(req, res, next);
});

router.get("/class/creator/get", (req, res, next) => {
  classApi.getClassForCreator(req, res, next);
});

router.get("/class/file/download", (req, res, next) => {
  classApi.downloadFile(req, res, next);
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

// 消息
router.get("/message/count", (req, res, next) => {
  messageApi.countMessage(req, res, next);
});
router.get("/message/get", (req, res, next) => {
  messageApi.getMessages(req, res, next);
});
router.get("/message/read", (req, res, next) => {
  messageApi.readMessage(req, res, next);
});
// 投稿
router.post("/video/upload", (req, res, next) => {
  uploadApi.upload(req, res, next);
});
router.post("/upload/submit", (req, res, next) => {
  uploadApi.submitUpload(req, res, next);
});
//配置
router.get("/config/index_banner/get", (req, res, next) => {
  configApi.getIndexBanner(req, res, next);
});

router.get("/config/subpage_banner/get", (req, res, next) => {
  configApi.getSubpageBanner(req, res, next);
});

router.get("/config/openai/get", (req, res, next) => {
  configApi.getOpenaiConfig(req, res, next);
});

router.get("/config/default_avatar/get", (req, res, next) => {
  configApi.getDefaultAvatar(req, res, next);
});
module.exports = router;

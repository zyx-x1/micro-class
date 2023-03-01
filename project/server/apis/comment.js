const { sqlMap } = require("../db/sqlMap");
const { db } = require("../db/db.js");
const { wss } = require("../ws");
const { sendMessage, deleteMessage } = require("./message")
module.exports = {
  async getComment(req, res, next) {
    let { classId } = req.query;
    let sql = `select * from comment where class_id = ?`;
    let _comments = await db(sql, [classId]);
    let comments = [];
    if (_comments.length == 0) return res.json({
      status: "success",
      data: []
    });
    _comments.forEach(async (comment, index) => {
      let initiator_email = comment.initiator_email;
      let replied_email = comment.replied_email;
      let initiator = await db(
        `select username,avatar,email from user where email = ?`,
        [initiator_email]
      );
      comment._initiator = initiator[0];
      let responder = await db(
        `select username,avatar,email from user where email = ?`,
        [replied_email]
      );
      comment._responder = responder[0];
      comments.push(comment);
      if (index == _comments.length - 1) {
        // 获取上级评论
        let superiorComments = comments.filter((el) => {
          return el.superior_id == null;
        });
        let subComments = comments.filter((el) => {
          return el.superior_id !== null;
        });
        // 获取下级评论
        superiorComments = superiorComments.map((el) => {
          let _subComments = [];
          subComments.forEach((sub) => {
            if (sub.superior_id == el.comment_id) {
              _subComments.push(sub);
            }
          });
          el._subComments = _subComments;
          return el;
        });
        return res.json({
          status: "success",
          data: superiorComments,
        });
      }
    });
  },
  async setComment(req, res, next) {
    let { initiator_email, replied_email, content, class_id, superioi_id } =
      req.query;
    replied_email = replied_email == undefined ? null : replied_email
    superioi_id = isNaN(parseInt(superioi_id)) ? null : parseInt(superioi_id)
    let inertData = [
      initiator_email,
      replied_email,
      new Date(),
      content,
      parseInt(class_id),
      superioi_id,
    ];
    let sql = `insert into comment (initiator_email,replied_email,date,content,class_id,superior_id) values (?,?,?,?,?,?)`;
    let result = await db(sql, inertData);
    sendMessage({ commentId: result.insertId, senderEmail: initiator_email, receiverEmail: !!replied_email ? replied_email : "", classId: parseInt(class_id), type: "comment", content })
    wss.clients.forEach((ws) => {
      ws.send(JSON.stringify({ msg: "comment update" }));
    });
    return res.json({
      status: "success",
    });
  },
  async deleteComment(req, res, next) {
    let { comment_id } = req.query
    let sql = `delete from comment where comment_id=?`
    let result = await db(sql, [comment_id])
    deleteMessage({ query: { commentId: comment_id } })
    wss.clients.forEach((ws) => {
      ws.send(JSON.stringify({ msg: "comment update" }));
    });
    return res.json({
      status: "success",
    });
  }
};

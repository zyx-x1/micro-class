const { sqlMap } = require("../db/sqlMap");
const { db } = require("../db/db.js");
const { wss } = require("../ws");
module.exports = {
  async getComment(req, res, next) {
    let { classId } = req.query;
    let sql = `select * from comment where class_id = ?`;
    let _comments = await db(sql, [classId]);
    let comments = [];
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
    let inertData = [
      initiator_email,
      replied_email,
      new Date(),
      content,
      parseInt(class_id),
      parseInt(superioi_id),
    ];
    let sql = `insert into comment (initiator_email,replied_email,date,content,class_id,superior_id) values (?,?,?,?,?,?)`;
    let result = await db(sql, inertData);
    wss.clients.forEach((ws) => {
      ws.send("comment update");
    });
  },
};

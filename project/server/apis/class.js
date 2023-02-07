const { sqlMap } = require("../db/sqlMap");
const { db } = require("../db/db.js");
module.exports = {
  async loadClass(req, res, next) {
    let pageSize = parseInt(req.query.page_size);
    let currPage = parseInt(req.query.curr_page);
    let id = req.query.id;
    let sql = !id ? sqlMap.getClass : sqlMap.getClassById;
    let insertData = !!id ? [id] : [currPage, pageSize];
    let data = await db(sql, insertData);
    return res.json({
      status: "success",
      data,
    });
  },
  async updateClassPlayCount(req, res, next) {
    let { id, count } = req.query;
    let sql = sqlMap.updateClassPlayCount;
    let data = await db(sql, [count, id]);
    let newCount = await db(`select play_count from micro_class where id=?`, [
      id,
    ]);
    return res.json({
      status: "success",
      count: newCount[0],
    });
  },
  async getClassLikeCollection(req, res, next) {
    let { id, email } = req.query;
    let sql_like = `select * from user_like where class_id = ?`;
    let sql_collection = `select * from user_collection where class_id = ?`;
    let likeRes = await db(sql_like, [id]);
    let collectionRes = await db(sql_collection, [id]);
    let isUserCollection = !!collectionRes.filter((el) => {
      return el.user_email == email;
    }).length;
    let isUserLike = !!likeRes.filter((el) => {
      return el.user_email == email;
    }).length;
    return res.json({
      status: "success",
      data: {
        like_count: likeRes.length,
        collection_count: collectionRes.length,
        is_user_like: isUserLike,
        is_user_collection: isUserCollection,
      },
    });
  },
  async likeClass(req, res, next) {
    let { id, email, isUserLike } = req.query;
    let result;
    if (JSON.parse(isUserLike)) {
      let sql = `insert into user_like (user_email,like_date,class_id) values (?,?,?)`;
      result = await db(sql, [email, new Date(), id]);
    } else {
      let sql = `delete from user_like where user_email = ?`;
      result = await db(sql, [email]);
    }
    return res.json({
      status: "success",
    });
  },
  async collectionClass(req, res, next) {
    let { id, email, isUserCollection } = req.query;
    let result;
    if (JSON.parse(isUserCollection)) {
      let sql = `insert into user_collection (user_email,collection_date,class_id) values (?,?,?)`;
      result = await db(sql, [email, new Date(), id]);
    } else {
      let sql = `delete from user_collection where user_email = ?`;
      result = await db(sql, [email]);
    }
    return res.json({
      status: "success",
    });
  },
};
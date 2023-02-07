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
     
  },
};

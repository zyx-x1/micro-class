const { sqlMap } = require("../db/sqlMap");
const { db } = require("../db/db.js");
module.exports = {
  async loadClass(req, res, next) {
    let pageSize = parseInt(req.query.page_size);
    let currPage = parseInt(req.query.curr_page);
    let id = req.query.id;
    let sql = !id ? sqlMap.getClass : sqlMap.getClassById;
    let insertData = !!id ? [id] : [currPage, pageSize];
    let datas = await db(sql, insertData);
    datas.forEach(async (data, index) => {
      let userid = data.creator_id
      let searchUserSql = `select avatar,username from user where id=?`
      let fileid = data.file_id
      let _file = null
      if (!!fileid) {
        let file = await db(`select * from micro_class_file where id=?`, [fileid])
        _file = file[0]
      }
      data._file = _file
      let userInfo = await db(searchUserSql, [userid])
      data._user = userInfo[0]
      if (datas.length == index + 1) {
        return res.json({
          status: "success",
          data: datas
        })
      }
    });
  },
  async updateClassPlayCount(req, res, next) {
    let { id, count } = req.query;
    id = parseInt(id)
    count = parseInt(count)
    let sql = sqlMap.updateClassPlayCount;
    console.log(`[count, id]`, [count, id]);
    let data = await db(sql, [count, id]);
    newCount = count
    return res.json({
      status: "success",
      count: newCount,
    });
  },
  async getClassLikeCollection(req, res, next) {
    let { id, email } = req.query;
    console.log(parseInt(id));
    let sql_like = `select * from user_like where class_id = ?`;
    let sql_collection = `select * from user_collection where class_id = ?`;
    let likeRes = await db(sql_like, [parseInt(id)]);
    console.log(likeRes);
    let collectionRes = await db(sql_collection, [parseInt(id)]);
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
  async searchClass(req, res, next) {
    let { key, page_size, curr_page } = req.query
    let sql = `select * from micro_class where title like ? and audit_status='pass'`
    let params = [`%${decodeURI(key)}%`]
    let result = await db(sql, params)
    let total = result.length
    let finalResult = []
    let end = (curr_page + 1) * page_size > total ? total : (curr_page + 1) * page_size
    finalResult = total > page_size ? result.slice(curr_page * page_size, end) : result
    return res.json({
      status: "success",
      data: finalResult,
      total
    });
  },
  async getAssociatedClass(req, res, next) {
    let { knowledge_information, classId } = req.query
    let tags = knowledge_information.split("|")
    let sql = `select * from micro_class where knowledge_information like`
    tags.forEach((tag, index) => {
      tag = `"%${tag}%"`
      if (index == 0) {
        sql += ` ${tag}`
      } else {
        sql += ` or knowledge_information like ${tag}`
      }
    })
    let result = await db(sql, [parseInt(classId)])
    result = result.filter(el => el.id != classId)
    return res.json({
      status: "success",
      data: result,
      total: result.length
    })

  },
  async getCommendClass(req, res, next) {
    let sql = `select * from micro_class where audit_status='pass' order by concat(collection,class_like,play_count) desc limit 0,10`
    let result = await db(sql)
    return res.json({
      status: "success",
      data: result,
      total: result.length
    })
  },
  async getCollections(req, res, next) {
    let { user_email } = req.query
    let get_classid_sql = `select class_id from user_collection where user_email = ?`
    let classIdRes = await db(get_classid_sql, [user_email])
    let classIds = classIdRes.map(el => el.class_id)
    let sql = `select * from micro_class where id in (${classIds.join(",")}) and audit_status='pass'`
    let data = await db(sql)
    return res.json({
      status: "success",
      data,
      total: data.length
    })
  },
  async getSubjects(req, res, next) {
    let data = [
      {
        value: '小学',
        label: '小学',
        children: []
      },
      {
        value: '初中',
        label: '初中',
        children: []
      },
      {
        value: '高中',
        label: '高中',
        children: []
      },
    ]
    // 小学
    let elementarySql = `select knowledge_information from micro_class where knowledge_information like "%小学%" and audit_status='pass'`
    let elementarys = await db(elementarySql)
    elementarys = [...new Set(elementarys.map(el => el.knowledge_information.split("|")[0].replace("小学", "")))]
    data[0].children = elementarys.map(el => {
      let temp = el
      el = {}
      el.value = temp
      el.label = temp
      return el
    })
    // 初中
    let middleSql = `select knowledge_information from micro_class where knowledge_information like "%初中%" and audit_status='pass'`
    let middles = await db(middleSql)
    middles = [...new Set(middles.map(el => el.knowledge_information.split("|")[0].replace("初中", "")))]
    data[1].children = middles.map(el => {
      let temp = el
      el = {}
      el.value = temp
      el.label = temp
      return el
    })
    // 高中
    let highSql = `select knowledge_information from micro_class where knowledge_information like "%高中%" and audit_status='pass'`
    let highs = await db(highSql)
    highs = [...new Set(highs.map(el => el.knowledge_information.split("|")[0].replace("高中", "")))]
    data[2].children = highs.map(el => {
      let temp = el
      el = {}
      el.value = temp
      el.label = temp
      return el
    })
    return res.json({
      status: "success",
      data
    })
  },
  async filterSubjectClass(req, res, next) {
    let { subject, page_size, curr_page } = req.query
    let sql = `select * from micro_class where knowledge_information like ? and audit_status='pass' order by upload_time desc limit ?,?`
    let result = await db(sql, [`%${subject}%`, (curr_page - 1) * page_size, parseInt(page_size)])
    let totalSql = `select count(id) from micro_class where knowledge_information like ? and audit_status='pass' order by upload_time desc`
    let totalResult = await db(totalSql, [`%${subject}%`])
    return res.json({
      status: "success",
      data: result,
      total: totalResult[0]['count(id)']
    })
  },
  async getNewClass(req, res, next) {
    let { page_size, curr_page } = req.query
    let totalSql = `select count(id) from micro_class where audit_status='pass' order by upload_time desc`
    let totalResult = await db(totalSql)
    let sql = `select * from micro_class where audit_status='pass' order by upload_time desc limit ?,?`
    let result = await db(sql, [(curr_page - 1) * page_size, parseInt(page_size)])
    return res.json({
      status: "success",
      data: result,
      total: totalResult[0]['count(id)']
    })
  },
  async getClassForCreator(req, res, next) {
    let { id, page_size, curr_page } = req.query
    let totalSql = `select count(id) from micro_class where creator_id=? and audit_status='pass'`
    let totalResult = await db(totalSql, [id])
    let sql = `select * from micro_class  where creator_id=? and audit_status='pass' order by upload_time desc limit ?,?`
    let result = await db(sql, [id, (curr_page - 1) * page_size, parseInt(page_size)])
    return res.json({
      status: "success",
      data: result,
      total: totalResult[0]['count(id)']
    })
  },
  async downloadFile(req, res, next) {
    let { classId, fileId, userId, userCredits, fileCredits } = req.query
    let sql = `update user set credits=? where id=?`
    let result = await db(sql, [userCredits - fileCredits, parseInt(userId)])
    return res.json({
      status: "success",
      data: {
        userCredits: userCredits - fileCredits
      }
    })
  }
}   

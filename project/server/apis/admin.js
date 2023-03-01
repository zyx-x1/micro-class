const { db } = require("../db/db.js");
const { isSameDay } = require("../utils/index")
const jwt = require("jsonwebtoken");
const secret = "zyxzyx"; //token密钥
const tokenExpiresTime = 1000 * 60 * 60 * 24 * 7; //token过期时间,毫秒为单位， 7天
module.exports = {
	async checkToken(req, res, next) {
		const { token } = req.query;
		let decodeToken = jwt.decode(token, secret);
		if (decodeToken) {
			if (new Date().getTime() - decodeToken.time > tokenExpiresTime) {
				return res.json({ status: "fail", msg: "token超时，请重新登录！" });
			} else {
				db(
					`select username,avatar,email,id from user where email="${decodeToken.email}"`
				)
					.then((user) => {
						return res.json({
							status: "success",
							user: user[0],
						});
					})
					.catch((err) => console.log(err));
			}
		}
	},
	async adminLogin(req, res, next) {
		let user = (await db(`select password from user where user_type='admin' and email="${req.query.email}"`))[0]
		if (!user) {
			return res.json({ status: "fail", msg: "管理员不存在" })
		}
		if (user.password === req.query.password) {
			let payload = {
				email: req.query.email,
				time: new Date().getTime(),
				exp: Date.now() + tokenExpiresTime,
			};
			let token = jwt.sign(payload, secret);
			db(
				`select username,avatar,email,id,username_updatetime from user where email="${req.query.email}"`
			)
				.then((resData) => {
					return res.json({
						status: "success",
						resData: resData[0],
						token,
					});
				})
				.catch((err) => console.log(err));
		} else {
			return res.json({ status: "fail", msg: "密码错误！" });
		}
	},
	async setVisitor(req, res, next) {
		let { visitor_type, visitor_id, user_id } = req.body
		visitor_id = !!visitor_id ? visitor_id : null
		user_id = !!user_id ? user_id : null
		if (!!user_id) {
			let searchSql = `select date from visitor where user_id=?`
			let dates = await db(searchSql, [user_id])
			let isExistRecord = dates.filter(el => isSameDay(new Date(), el.date))
			if (isExistRecord.length > 0) {
				return res.json({
					status: "fail"
				})
			}
		}
		let sql = `insert into visitor (date, visitor_type, visitor_id, user_id) values (?,?,?,?)`
		let result = await db(sql, [new Date(), visitor_type, visitor_id, user_id])
		return res.json({
			status: "success"
		})
	},
	async getVisitor(req, res, next) {
		let sql = `select * from visitor`
		let data = await db(sql)
		return res.json({
			status: "success",
			data
		})
	},
	async getUserInfo(req, res, next) {
		let { user_type, currPage, pageSize } = req.query
		let totalSql = `select count(id) from user where user_type like ?`
		let total = await db(totalSql, [`%${user_type}%`])
		total = total[0]['count(id)']
		let sql = `select id,username,avatar,email,signuptime,username_updatetime,user_type from user where user_type like ? order by id asc limit ?,?`
		let data = await db(sql, [`%${user_type}%`, pageSize * (currPage - 1), parseInt(pageSize)])
		return res.json({
			status: "success",
			data,
			total
		})
	},
	async getAudit(req, res, next) {
		let { currPage, pageSize } = req.query
		let totalSql = `select count(id) from micro_class where audit_status='to_audit'`
		let total = await db(totalSql)
		total = total[0]['count(id)']
		let sql = `select * from micro_class where audit_status='to_audit' order by upload_time desc limit ?,?`
		let datas = await db(sql, [pageSize * (currPage - 1), parseInt(pageSize)])
		datas.forEach(async (data, index) => {
			let userid = data.creator_id
			let searchUserSql = `select avatar,username from user where id=?`
			let userInfo = await db(searchUserSql, [userid])
			data._user = userInfo[0]
			if (datas.length == index + 1) {
				return res.json({
					status: "success",
					data: datas,
					total
				})
			}
		});
		if (datas.length == 0) {
			return res.json({
				status: "success",
				data: [],
				total
			})
		}

	},
	async submitAudit(req, res, next) {
		let { status, id, admin, creatorId, adminName } = req.query
		let sql = `update micro_class set audit_status=?,audit_admin_id=? where id=?`
		let result = await db(sql, [status, parseInt(admin), parseInt(id)])
		if (result.protocol41) {
			let userEmail = (await db("select email from user where id=?", [creatorId]))[0].email

			let messageSql = `insert into message (receiver_email,class_id,date,type,is_read,content) values (?,?,?,?,?,?)`
			let messageData = [
				userEmail,
				id,
				new Date(),
				"audit",
				0,
				`您的视频审核${status == "refuse" ? "未" : ""}通过，审核人：${adminName}`
			]
			await db(messageSql, messageData)
			return res.json({
				status: "success"
			})
		}
	},
	async getConfig(req, res, next) {
		let sql = `select * from config`
		let result = await db(sql)
		return res.json({
			status: "success",
			data: result[0]
		})
	},
	async updateConfig(req, res, next) {
		let configs = req.body
		let configValues = Object.values(configs)
		let sql = `update config set openai_sdk=?,openai_model=?,index_banner=?,subpage_banner=?,ai_avatar=?,default_avatar=?,openai_max_token_size=?`
		let result = await db(sql, configValues)
		return res.json({
			status: "success",
		})
	}
}
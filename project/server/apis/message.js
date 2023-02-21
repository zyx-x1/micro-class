const { db } = require("../db/db")
const { wss } = require("../ws")
module.exports = {
    async sendMessage(params) {
        let { commentId, senderEmail, receiverEmail, classId, type, content } = params
        let sql = `insert into message (comment_id,sender_email,receiver_email,class_id,date,type,content) values (?,?,?,?,?,?,?)`
        let sqlParams = [commentId, senderEmail, receiverEmail, classId, new Date(), type, content]
        console.log(params);
        let result = await db(sql, sqlParams)
        wss.clients.forEach((ws) => {
            ws.send(
                JSON.stringify({
                    msg: "message update",
                    user: receiverEmail
                })
            );
        });
        return true;
    },
    async countMessage(req, res, next) {
        let { user } = req.query
        let sql = `select id from message where receiver_email=?`
        let result = await db(sql, [user])
        return res.json({
            status: "success",
            total: result.length
        })
    },
    async deleteMessage(req, res, next) {
        let { commentId } = req.query
        let sql = `delete from message where comment_id=?`
        let result = await db(sql, [commentId])
        wss.clients.forEach((ws) => {
            ws.send(
                JSON.stringify({
                    msg: "message update"
                })
            );
        });
        return true;
    }
}
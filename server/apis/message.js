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
        let sql = `select id from message where is_read is null  and receiver_email=?`
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
    },
    async getMessages(req, res, next) {
        let { user } = req.query
        let sql = `select * from message where receiver_email=? order by date desc`
        let result = await db(sql, [user])
        result.forEach(async (el, index) => {
            let senderEamil = el.sender_email
            let get_sender_sql = `select avatar,username from user where email='${senderEamil}'`
            let sender = await db(get_sender_sql)
            let get_class_title_sql = `select title from micro_class where id='${el.class_id}'`
            let classTitle = await db(get_class_title_sql)
            result[index]._sender = sender[0]
            result[index]._class_title = classTitle[0].title
            if (index == result.length - 1) {
                return res.json({
                    status: "success",
                    data: result,
                    total: result.length
                })
            }
        })
    },
    async readMessage(req, res, next) {
        let { id } = req.query
        let sql = `update message set is_read=1 where id=?`
        let result = await db(sql, [id])
        wss.clients.forEach((ws) => {
            ws.send(
                JSON.stringify({
                    msg: "message update"
                })
            );
        });
        return res.json({
            status: "success"
        })
    }
}
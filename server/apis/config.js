const { db } = require("../db/db")
module.exports = {
    async getIndexBanner(req, res, next) {
        let sql = `select index_banner from config`
        let result = await db(sql)
        return res.json({
            status: "success",
            data: result[0].index_banner
        })
    },
    async getSubpageBanner(req, res, next) {
        let sql = `select subpage_banner from config`
        let result = await db(sql)
        return res.json({
            status: "success",
            data: result[0].subpage_banner
        })
    },
    async getOpenaiConfig(req, res, next) {
        let sql = `select openai_sdk,openai_model,ai_avatar,openai_max_token_size from config`
        let result = await db(sql)
        return res.json({
            status: "success",
            data: result[0]
        })
    },
    async getDefaultAvatar(req, res, next) {
        let sql = `select default_avatar from config`
        let result = await db(sql)
        return res.json({
            status: "success",
            data: result[0].default_avatar
        })
    }
}
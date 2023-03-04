
const { Console } = require("console");
const fs = require("fs");
const { resolve } = require("path");
const { db } = require("../db/db")
module.exports = {
    async upload(req, res, next) {
        let file = req.files.file
        let filePath = resolve(__dirname, "../resource/" + file.name)
        fs.writeFileSync(filePath, file.data, (err) => {
            if (err) console.log(`err`, err);
        })
        let videoSrc = `http://localhost:3000/${file.name}`
    },
    async submitUpload(req, res, next) {
        let { fileName, file, fileCredits, fileType, author_name, author_avatar, author_area, author_school, author_intro, class_title, class_intro, class_type, class_level, knowladge_tags, chapter_tags, cover_image, video_src, creator_id } = req.body
        let annexSql = `insert into micro_class_file (filename,file,filetype,credits) values (?,?,?,?)`
        let annexResult = await db(annexSql, [fileName, file, parseInt(fileCredits), fileType])
        let sql = `insert into micro_class (video_src,title,author_avatar,author_name,author_identity,author_area,author_school,author_introduce,upload_time,knowledge_information,chapter_information,type,level,content_description,class_like,collection,cover_image,audit_status,file_id,creator_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) `
        let params = [
            video_src,
            class_title,
            author_avatar,
            author_name,
            "老师",
            author_area,
            author_school,
            author_intro,
            new Date(),
            knowladge_tags,
            chapter_tags,
            class_type,
            class_level,
            class_intro,
            0,
            0,
            cover_image,
            "to_audit",
            annexResult.insertId,
            creator_id
        ]

        let result = await db(sql, params)
        return res.json({
            status: "success"
        })
    }
}
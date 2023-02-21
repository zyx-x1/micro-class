
const fs = require("fs");
const { resolve } = require("path");
module.exports = {
    upload(req, res, next) {
        console.log(__dirname)
        let file = req.files.file
        console.log(`file.data`, file.data);
        let filePath = resolve(__dirname, "../videos/" + file.name)
        fs.writeFileSync(filePath, file.data, (err) => {
            if (err) console.log(`err`, err);
        })
    }
}
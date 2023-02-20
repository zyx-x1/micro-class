const { db } = require("./db");
const fs = require("fs");

const dealTagArray = (param) => {
  let res = param;
  if (param instanceof String) {
    res = JSON.parse(param);
  }
  res = res.join("|");
  return res;
};

const migrationToMicroTable = (data) => {
  let {
    microClassTitle,
    videoSrc,
    authorAvatar,
    authorName,
    authorIdentity,
    authorArea,
    authorSchool,
    authorIntroduce,
    microClassUploadTime,
    microClassKnowledgeInformation,
    microClassChapterInformation,
    microClassType,
    microClassLevel,
    microClassContentDescription,
  } = data;
  microClassUploadTime =
    typeof microClassUploadTime == "string"
      ? new Date(microClassUploadTime)
      : microClassUploadTime;
  microClassKnowledgeInformation = dealTagArray(microClassKnowledgeInformation);
  microClassChapterInformation = dealTagArray(microClassChapterInformation);
  let videoCover = videoSrc.replace(".mp4", ".jpg");
  let insertSql =
    "insert into micro_class (video_src,title,author_avatar,author_name,author_identity,author_area,author_school,author_introduce,upload_time,knowledge_information,chapter_information,type,level,content_description,cover_image) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  console.log(``, [
    videoSrc,
    microClassTitle,
    authorAvatar,
    authorName,
    authorIdentity,
    authorArea,
    authorSchool,
    authorIntroduce,
    microClassUploadTime,
    microClassKnowledgeInformation,
    microClassChapterInformation,
    microClassType,
    microClassLevel,
    microClassContentDescription,
    videoCover,
  ]);
    db(insertSql, [
    videoSrc,
    microClassTitle,
    authorAvatar,
    authorName,
    authorIdentity,
    authorArea,
    authorSchool,
    authorIntroduce,
    microClassUploadTime,
    microClassKnowledgeInformation,
    microClassChapterInformation,
    microClassType,
    microClassLevel,
    microClassContentDescription,
    videoCover,
  ])
    .then(() => {
      return;
    })
    .catch((err) => {
      return console.log(err);
    });
};

const DATAS = JSON.parse(fs.readFileSync("./MICROCLASS.json"));
DATAS.forEach((el) => {
  migrationToMicroTable(el);
});

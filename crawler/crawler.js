const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");

const http = (uri) => {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: uri,
        method: "GET",
      },
      (err, response, body) => {
        if (err) {
          console.log(err);
        }
        resolve(body);
      }
    );
  });
};
let idDatas = [];
let ids = [];
const maxPageSize = 100;
const getMicros = async () => {
  for (let i = 1; i <= maxPageSize; i++) {
    let target = `http://ziyuan.cnweike.cn/index.php?r=resource/search/GetJson&type=weike&keyword=%E8%AF%B7%E8%BE%93%E5%85%A5%E5%85%B3%E9%94%AE%E5%AD%97&page=${i}&pageSize=10&grade=0&subject=0&pointOne=0&pointTwo=0&pointThree=0&version=0&textbook=0&unit=0&course=0&courseType=0&order=&areaID=0&exerciseTypeID=0&extType=0&year=0&examTypeID=0&searchField=`;
    let jsonStringify = await http(target);
    let data = JSON.parse(jsonStringify).data;
    idDatas = [...idDatas, ...data];
    fs.writeFileSync(
      "./ID_DATAS.json",
      JSON.stringify(idDatas),
      function (err) {
        if (err) return console.log(err);
      }
    );
    ids = [...ids, ...data.map((el) => el.id)];
    if (i == maxPageSize) {
      let htmls = [];
      ids.forEach(async (id, index) => {
        let insideTarget = `http://ziyuan.cnweike.cn/index.php?r=resource/play&id=${id}`;
        let insideJsonStringify = await http(insideTarget);
        htmls = [...htmls, insideJsonStringify];
        // fs.writeFileSync(
        //   "./INSIDE_HTML.json",
        //   JSON.stringify(htmls),
        //   function (err) {
        //     if (err) return console.log(err);
        //   }
        // );
        if (index == ids.length - 1) {
          htmls.forEach((html) => {
            const $ = cheerio.load(html);
            let microClassTitle = $(".r_details_box.pb10>h1").text();
            // console.log("课题 ->", microClassTitle);
            let videoSrc = html.match(/<source src="(\S*)" type=/)[1];
            // console.log("视频链接 ->", videoSrc);

            let authorAvatar = $("div.r_detailsHead a img").attr("src");
            // console.log("头像 ->", authorAvatar);
            let authorName = $("div.r_detailsHead")
              .next()
              .find(".green.mt5.f14")
              .html();
            // console.log("名字 ->", authorName);
            let authorIdentity = $("div.r_detailsHead")
              .next()
              .find(".green.mt5.f14")
              .next()
              .find(".green")
              .html();
            // console.log("身份 ->", authorIdentity);
            let authorArea = $(".r_details_show>.border_b>.mt10.lh20").text();
            authorArea = authorArea
              .replace(/\s*/g, "")
              .substring(3, authorArea.length);
            // console.log("地区 ->", authorArea);
            let authorSchool = $(
              ".r_details_show>.border_b>.mt6.lh20>span"
            ).text();
            // console.log("学校 ->", authorSchool);
            let authorIntroduce = $(
              ".r_details_show>.border_b>.lh20.mt5.gray"
            ).text();
            // console.log("简介 ->", authorIntroduce);
            let microClassUploadTime = $(
              ".r_details_show>.w.mt10.pb5>.mt10.lh20"
            ).text();
            microClassUploadTime = microClassUploadTime.substring(
              5,
              microClassUploadTime.length
            );
            // console.log("上传时间 ->", microClassUploadTime);
            let microClassKnowledgeInformation = $(
              ".r_details_show>.w.mt10.pb5>.mt3.f12.gray2"
            )
              .next()
              .find("span")
              .html()
              .split("<br>")
              .map((el) => el.replace("\n", "").replace(/\s*/g, ""))
              .filter((el) => !!el);
            // console.log("知识点信息 ->", microClassKnowledgeInformation);
            let microClassChapterInformation = $(
              ".r_details_show>.w.mt10.pb5>.mt3.f12.gray2"
            )
              .next()
              .next()
              .find("span")
              .html()
              .split("<br>")
              .map((el) => el.replace("\n", "").replace(/\s*/g, ""))
              .filter((el) => !!el);
            // console.log("章节信息 ->", microClassChapterInformation);
            let microClassType = $(".r_details_show>.w.mt10.pb5>.mt3.f12.gray2")
              .next()
              .next()
              .next()
              .html();
            microClassType = microClassType.substring(5, microClassType.length);
            // console.log("课程类型 ->", microClassType);
            let microClassLevel = $(
              ".r_details_show>.w.mt10.pb5>.mt3.f12.gray2"
            )
              .next()
              .next()
              .next()
              .next()
              .html();
            microClassLevel = microClassLevel.substring(
              5,
              microClassLevel.length
            );
            // console.log("课程难度 ->", microClassLevel);
            let microClassContentDescription = $(
              ".r_details_show>.w.mt10.pb5>.mt3.f12.gray2"
            )
              .next()
              .next()
              .next()
              .next()
              .next()
              .next()
              .html();
            // console.log("内容说明 ->", microClassContentDescription);
            let insertData = {
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
            };
            // console.log("insertData ->", insertData);
            let MICROCLASS = JSON.parse(
              fs.readFileSync("./MICROCLASS.json").toString()
            );
            MICROCLASS = [...MICROCLASS, insertData];
            fs.writeFileSync(
              "./MICROCLASS.json",
              JSON.stringify(MICROCLASS),
              (err) => {
                if (err) return console.log("ERROR ->", err);
              }
            );
            // console.log("MICROCLASS ->", MICROCLASS);
          });
        }
      });
    }
  }
};
// getMicros();

const { sqlMap } = require("../db/sqlMap");
const { db } = require("../db/db.js");
const { transport } = require("../mail");
const jwt = require("jsonwebtoken");
const secret = "zyxzyx"; //token密钥
const tokenExpiresTime = 1000 * 60 * 60 * 24 * 7; //token过期时间,毫秒为单位， 7天
const { getPostData } = require("../utils/index");
const defaultAvatar = require("../utils/defaultAvatar");
module.exports = {
  checkToken(req, res, next) {
    const { token } = req.query;
    let decodeToken = jwt.decode(token, secret);
    if (decodeToken) {
      if (new Date().getTime() - decodeToken.time > tokenExpiresTime) {
        return res.json({ status: "fail", msg: "token超时，请重新登录！" });
      } else {
        db(
          `select username,avatar,email,username_updatetime from user where email="${decodeToken.email}"`
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
  loader(req, res, next) {
    const { ip, token } = req.query;
    let decodeToken = jwt.decode(token, secret);
    let user = decodeToken ? decodeToken.user : "游客";
    let time = new Date();
    const sql = sqlMap.searchUseraccess;
    const insertSql = sqlMap.insertUseraccess;
    db(sql, [ip]).then((result) => {
      let year = time.getFullYear();
      let month = time.getMonth();
      let date = time.getDate();
      if (result) {
        if (result instanceof Array) {
          let isNew = result.every((el) => {
            if (year == el.year) {
              if (month == el.month) {
                if (date == el.date) {
                  return false;
                }
                return true;
              }
              return true;
            }
            return true;
          });
          if (isNew) {
            db(insertSql, [year, month + 1, date, ip, user]);
          }
        } else {
          if (
            year != result.year &&
            month != result.month &&
            date != result.date
          ) {
            db(insertSql, [year, month + 1, date, ip]);
          }
        }
      } else {
        db(insertSql, [year, month + 1, date, ip]);
      }
      if (decodeToken) {
        if (new Date().getTime() - decodeToken.time > tokenExpiresTime) {
          return res.json({ status: "timeout" });
        } else {
          db(
            `select username,head from user where username="${decodeToken.user}"`
          ).then((user) => {
            return res.json({
              status: "success",
              user,
            });
          });
        }
      }
    });
  },
  unloader(req, res, next) {
    let { onlinetime, user } = req.query;
    db(`select onlinetime from user where username='${user}'`).then((resp) => {
      if (resp[0]) {
        let userOnlineTime = resp[0].onlinetime;
        let newOnlineTime = parseInt(onlinetime) + parseInt(userOnlineTime);
        db(
          `update user set onlinetime='${newOnlineTime}' where username='${user}'`
        ).then(() => {
          return res.json({ status: "success" });
        });
      }
    });
  },
  login(req, res, next) {
    db(`select password from user where email="${req.query.email}"`).then(
      (user) => {
        if (!user[0]) {
          return res.json({ status: "fail", msg: "用户不存在" });
        } else {
          if (user[0].password === req.query.password) {
            let payload = {
              email: req.query.email,
              time: new Date().getTime(),
              exp: Date.now() + tokenExpiresTime,
            };
            let token = jwt.sign(payload, secret);
            db(
              `select username,avatar,email,username_updatetime from user where email="${req.query.email}"`
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
        }
      }
    );
  },
  register(req, res, next) {
    let insertData = Object.values(req.query);
    console.log(insertData);
    let sql = sqlMap.getUser;
    let [username, email, password, signuptime, avatar] = insertData;
    avatar = defaultAvatar.defaultAvatar;
    db(sql).then((users) => {
      let isExistUser = users.every((item) => {
        return item.username !== username;
      });
      if (!isExistUser) {
        return res.json({ status: "fail", msg: "用户名已存在" });
      } else {
        //向数据库插入数据
        let insertUserSql = sqlMap.insertUser;
        let insertParams = [
          username,
          password,
          email,
          new Date(signuptime),
          avatar,
          new Date(),
        ];
        db(insertUserSql, insertParams)
          .then(() => {
            return res.json({ status: "success" });
          })
          .catch((err) => console.log(err));
      }
    });
  },
  updateUsername(req, res, next) {
    let { email, newName, username_updatetime } = req.query;
    let sql = sqlMap.updateUsername;
    db(sql, [newName, new Date(username_updatetime), email])
      .then(() => {
        return res.json({
          status: "success",
          msg: "用户名修改成功！",
        });
      })
      .catch((err) => console.log(err));
  },
  resetpwd(req, res, next) {
    let userIndex = -1;
    let selectUserSql = sqlMap.getUser;
    db(selectUserSql).then((val) => {
      val.forEach((item, index) => {
        if (item.username === req.query.username) {
          userIndex = index;
        }
      });
      let updatePwdSql = sqlMap.updatePassword;
      let updateParams = [req.query.password, req.query.username];
      db(updatePwdSql, updateParams).then(() => {
        return res.send({ status: 1 });
      });
    });
  },
  rEmailCode(req, res, next) {
    let code;
    let sql = sqlMap.getUser;
    let reqMail = req.query.email;
    db(sql).then((val) => {
      let noExist = val.every((el) => el.email != reqMail);
      if (!noExist) {
        return res.json({ status: "fail", msg: "该邮箱已注册！" });
      } else {
        code = Math.floor(Math.random() * 900000) + 100000;
        let mailOptions = {
          from: `x75046@qq.com`,
          to: reqMail,
          subject: "微课网注册验证码",
          text: `${code}`,
          html: `<p style=""align:center;>您此次的验证码为</p>
          <h2 style=""align:center;>${code}</h2>`,
        };
        transport.sendMail(mailOptions, (err, info) => {
          if (err) console.log(err);
          return res.json({ status: "success", code });
        });
      }
    });
  },
  email(req, res, next) {
    let code;
    let sql = sqlMap.getUser;
    db(sql).then((val) => {
      let userIndex = -1;
      val.forEach((item, index) => {
        if (item.username === req.query.username) {
          userIndex = index;
        }
      });
      if (userIndex === -1) {
        return res.send({ status: "fail", msg: "用户名不存在" });
      } else {
        code = Math.floor(Math.random() * 9000) + 1000;
        let mailOptions = {
          from: `x75046@qq.com`,
          to: val[userIndex].mail,
          subject: "VCANVAS验证码",
          text: `${code}`,
          html: `<p style=""align:center;>您的验证码为</p>
          <h2 style=""align:center;>${code}</h2>`,
        };
        transport.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
          }
          return res.json({ status: "success", code });
        });
      }
    });
  },
  async loadClass(req, res, next) {
    let pageSize = parseInt(req.query.page_size);
    let currPage = parseInt(req.query.curr_page);
    let sql = sqlMap.getClass;
    let data = await db(sql, [currPage, pageSize]);
    return res.json({
      status: "success",
      data,
    });
  },
};

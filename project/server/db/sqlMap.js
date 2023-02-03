exports.sqlMap = {
  getUser: "select * from user",
  updatePassword: "update user set password = ? where email = ?",
  insertUser:
    "insert into user (username,password,email,signuptime,avatar,username_updatetime) values (?,?,?,?,?,?)",
  updateUsername:
    "update user set username=?,username_updatetime=? where email=?",
  getClass: "select * from micro_class limit ?,?"
};

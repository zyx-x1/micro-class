exports.sqlMap = {
  getUser: "select * from user",
  updatePassword: "update user set password = ? where email = ?",
  insertUser:
    "insert into user (username,password,email,signuptime,avatar,username_updatetime) values (?,?,?,?,?,?)",
  updateUsername:
    "update user set username=?,username_updatetime=? where email=?",
  getClass: "select * from micro_class order by upload_time desc limit ?,?",
  getClassById:
    "select * from micro_class m left join comment c on m.id=c.class_id  where m.id = ?",
  updateClassPlayCount: "update micro_class set play_count=? where id=?",
};

const mysql = require('mysql');
const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: 'adminzyx',
  database: 'wzq',
  port: '3307'
}
const conn = mysql.createConnection(mysqlConfig);
conn.connect();
/*
 *@param {String} sql语句,sql语句参数
 *@return {Object} Promise对象,resolve为sql语句运行结果,reject为错误对象
 */
exports.db = (sql, params) => {
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject('[sql error] - ', error);
      }
    })
  })
}
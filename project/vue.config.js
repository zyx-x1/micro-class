module.exports = {
  devServer: {
    proxy: {
      "/": {
        target: "http://47.113.150.244:3000//", // 后端接口
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          "/api": "",
        },
      },
    },
  },
  assetsDir: "static",
  parallel: false,
  publicPath: "./",
};

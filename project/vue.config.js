module.exports = {

    devServer: {
        proxy: {
            '/': {
                target: 'http://localhost:3000//',// 后端接口
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '/api': ''
                }
            }
        }
    }
}


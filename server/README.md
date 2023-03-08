# project

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Project directory
- project 项目源码
  - node_modules 依赖包（由npm安装）
  - public 公共文件夹
    - img 图片
    - favicon.ico 浏览器标志
    - index.html 网站本体
  - static 、静态文件（项目启动时不会被编译）
  - src 前端源码
    - assets 文件（项目启动时会被编译）
    - components 公共组件
    - views 页面（此目录下文件为各个路由页面）
    - App.vue 主页面，各路由文件均会被集成到App中的router-view中
    - main.js 项目入口
    - registerServiceWorker.js 配置文件
    - router.js 路由文件，制定路由规则
    - store.js vuex文件，项目临时变量仓库
  - server 后端源码
    - apis 接口目录
      - index.js 存放接口函数
    - db 数据库目录
      - db.js 数据库配置，暴露出sql语句处理函数
      - sqlMap.js 定义sql映射
    - utils 工具函数目录
    - app.js 服务器入口，定义服务器端口、跨域等规则
    - mail.js 邮箱配置
    - router.js 定义后端路由
  - .gitignore 定义git上传时不被push的文件类型
  - babel.config.js babel配置文件
  - package.json 项目依赖项
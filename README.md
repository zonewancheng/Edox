#  Edox - 伊度(vue 分支)
	 暂停中，一不小心又给自己挖了个大坑
### 准备工作
-------

###### 安装nodejs
    略
###### 全局安装gulp
    npm install -g gulp
###### 切换到build文件夹下
    cd build
######  安装项目依赖文件
    npm install
######  在build/map.js中配置需要生成的页面模版文件后执行（此处已有示例）
    node map.js (注意：此处会覆盖 src目录 最外层的 html文件 ⚠️)
### 开始使用
######  本地开发模式
    gulp
######  预发环境打包（js,css,html不压缩混淆）
    gulp develop
######  正式环境打包（js,css,html压缩混淆）
    gulp product


###  开发配置使用详情 请参看build/gulpfile.js

    pages文件夹下为单个页面，注意每个页面文件夹目前仅支持单个less,html,js
### 其它（目前功能）
> 1. 支持less
> 2. ES6到ES5
> 3. 压缩混淆
> 4. 本地开发环境实时修改刷新
> 5. sourceMap
> 6. 文件hash值
> 7. Vue路由
> 8. 单页应用
> 9. 代码分割

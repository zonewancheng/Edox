/**
 * Created by zone on 2016/9/20.
 * 自动配置创建HTML模板文件和对应的页面文件夹
 * 需求模块 fs
 * 在需求目录下执行 node map.js
 */
var fs = require("fs");

var head = "<!--_HEAD_CONTAINER_-->";
var body = "<Edox><!--_BODY_CONTAINER_--></Edox>";
var foot = "<!--_FOOT_CONTAINER_-->";
var other = "<!--_OTHER_CONTAINER_-->";

var headerReplace = [
        '<meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui" />',
        '<meta content="yes" name="apple-mobile-web-app-capable" />',
        '<meta content="black" name="apple-mobile-web-app-status-bar-style" />',
        '<meta name="format-detection" content="telephone=no" />',
        '<meta name="full-screen" content="yes">',
        '<meta name="browsermode" content="application">',
        '<meta name="x5-fullscreen" content="true">',
        '<meta name="x5-page-mode" content="app">',
        '<meta name="description" content="Edox">',
        '<meta http-equiv="Pragma" content="no-cache">',
        '<meta http-equiv="Cache-Control" content="no-cache">',
        '<meta http-equiv="x-dns-prefetch-control" content="on" />',
        '<meta http-equiv="Expires" content="0">',
        '<meta name="keywords" content="javascript,node,libs">',
        '<link rel="icon" href="favicon.ico" type="image/x-icon" />',
        '<link rel=dns-prefetch href="" >',
        '<link rel=dns-prefetch href="" >',
        '<link href="css/zui.css" >',
    ],
    footerReplace = [
        '<script  type="text/javascript" src="js/vue.js"></script>'
    ],
    bodyReplace = [
        '<div id="Edox-container">',
        '</div>'
    ];

//需要创建的文件及对应标题列表
var pageList = { //页面列表
    //模块A
    "index": "Edox 首页",
    //模块B
    "login": "登录",
    //模块C
    "register": "注册",
    //模块D
    "logout":"退出"
};
var basePath = "../src/";//生成文件放置的路径
var reCreate = true;//已有的文件是否重新创建，暂未打算支持， 可扩展

//文件路径不统一覆盖
for(var key in pageList){
    if (fs.existsSync(basePath+"pages/"+key)) {
        console.log("已创建过"+basePath+ key+"目录");
    } else {
        fs.mkdirSync(basePath+"pages/"+key);
        console.log('目录'+basePath+ key+'已创建成功\n');
    }
}


//console.log(pageList);

//模版文件统一重新覆盖
for (var key in pageList) {
    console.log(key);
    var template =
        "<html>\n" +
            "<head>\n" +
            "<title>" + pageList[key] + "</title>\n" +
            headerReplace.join("") + "\n" +
            head + "\n" +
            "</head>\n" +
            "<body>\n" +
            body + "\n" +
            "</body>\n" +
            footerReplace.join("") + "\n" +
            foot +
            other + "\n" +
        "</html>";
    //创建文件
    fs.writeFile(basePath + key + ".html", template, function (err) {
        if (err) throw err;
        console.log("生成模版"+basePath + key + ".html"+"页面");
    });
}

//读取文件
// fs.readFile("bb.txt","utf8",function (error,data){
//     if(error) throw error ;
//     console.log(data) ;
// }) ;
//创建文件
//fs.writeFile("bb.txt", "哈哈哈", function (err) {
//    if (err) throw err;
//});
// // 修改文件名称
// fs.rename('bb.txt','bigbear.txt',function(err){
//     console.log('rename success') ;
// });
// 删除文件
//fs.unlink('bb.txt', function(){
//    console.log('success') ;
//}) ;
// // 查看文件状态
// fs.stat('bb.txt', function(err, stat){
//     console.log(stat);
// });

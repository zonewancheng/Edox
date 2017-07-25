/**
 * Created by oospace on 2016/9/20.
 * 自动配置创建HTML模板文件
 * 需求模块 fs
 * 在需求目录下执行 node fs.js
 */
var fs = require("fs");

var head = "<!--_HEAD_CONTAINER_-->";
var body = "<Edox><!--_BODY_CONTAINER_--></Edox>";
var foot = "<!--_FOOT_CONTAINER_-->";
var other = "<!--_OTHER_CONTAINER_-->";
//需要创建的文件及对应标题列表
var pageList = { //页面列表
    //模块A
    "index": "首页",
    //模块B
    "login": "登录",
    //模块C
    "register": "注册"
};
var basePath = "../src/";//文件路径
var reCreate = true;//已有的文件是否重新创建，暂不支持， 可扩展

/*if (fs.existsSync(basePath)) {
 console.log('已经创建过此目录了');
 } else {
 fs.mkdirSync(basePath);
 console.log('目录已创建成功\n');
 }*/

console.log(pageList);
for (var key in pageList) {
    console.log(key);
    var template = "<!DOCTYPE html>\n" +
        "<html>\n" +
        "<head>\n" +
        "<title>" + pageList[key] + "</title>\n" +
        head + "\n" +
        "</head>\n" +
        "<body>\n" +
        body + "\n" +

        "</body>\n" +
        foot + "\n" +
        other + "\n" +
        "</html>";
    //创建文件
    fs.writeFile(basePath + key + ".html", template, function (err) {
        if (err) throw err;
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
// // 判断文件是否存在
// fs.exists('bb.txt', function( exists ){
//     console.log( exists ) ;
// }) ;
/**
 * Created by zone on 2016/9/20.
 * 自动配置创建HTML模板文件和对应的页面文件夹
 * 需求模块 fs
 * 在需求目录下执行 node map.js
 */
let fs = require("fs");

let head = "<!--_HEAD_CONTAINER_-->";
let body = "<div id='eDox-container'><!--_BODY_CONTAINER_--></div>";
let foot = "<!--_FOOT_CONTAINER_-->";
let other = "<!--_OTHER_CONTAINER_-->";
let version = new Date().getTime();
let headerReplace = [
        '<meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">',
        //'<meta content="yes" name="apple-mobile-web-app-capable" />',
        '<meta content="black" name="apple-mobile-web-app-status-bar-style" />',
        '<meta name="format-detection" content="telephone=no" />',
        '<meta name="full-screen" content="yes">',
        //'<meta name="browsermode" content="application">',
        '<meta name="x5-fullscreen" content="true">',
        //'<meta name="x5-page-mode" content="app">',
        '<meta name="description" content="Reader">',
        '<meta http-equiv="Pragma" content="no-cache">',
        '<meta http-equiv="Cache-Control" content="no-cache">',
        '<meta http-equiv="x-dns-prefetch-control" content="on" />',
        '<meta http-equiv="Expires" content="0">',
        '<meta name="keywords" content="前端,互联网,科技,安全,RSS">',
        '<link rel="icon" href="imgs/icon_32.ico" type="image/x-icon" />',
        '<link rel="apple-touch-icon" href="imgs/icon.png">',
        '<link rel=dns-prefetch href="http://www.xicer.com" >',
        '<link rel=dns-prefetch href="http://www.xicer.com" >',
        '<link rel="stylesheet" href="css/zui.css?v='+version+'" >'
    ],
    footerReplace = [
	    //'<script  type="text/javascript" src="js/requirejs.js?v='+version+'"></script>',
	    '<script  type="text/javascript" src="js/vue.js?v='+version+'"></script>',
        '<script  type="text/javascript" src="js/vue-router.js?v='+version+'"></script>',
        '<script  type="text/javascript" src="js/router.js?v='+version+'"></script>',
        '<script  type="text/javascript" src="js/component.js?v='+version+'"></script>',
        '<script  type="text/javascript" src="js/rss-parser.js?v='+version+'"></script>',
        '<script  type="text/javascript" src="js/axios.js?v='+version+'"></script>'

    ]
    bodyReplace = [
        '<div id="Edox-container">',
        '</div>'
    ],
    otherReplace = [
        '<script>',
        '</script>'
    ];
    

//需要创建的文件及对应标题列表
let pageList = [ //页面列表
    //模块A
    {   name:"index",
	    title: "Reader",
	    components:[
        "header"
        ]
    },
    {name:"list",title:"文章列表"},
    {name:"zone",title:"你猜，你猜，你猜猜猜；我写，我写，我写写写"},
    {name:"login",title:"登录"},
    {name:"register",title:"注册"},
    {name:"404",title:"404"},
    {name:"links",title:"链接"},
    {name:"logout",title:"退出"},
    {name:"upload",title:"上传"},
    {name:"article",title:"文章"},
    {name:"user",title:"用户"},
    {name:"error",title:"错误信息"},
    {name:"edit",title:"编辑页面"},
    {name:"comments",title:"评论"}
];
let developPath = "../client/src/";
let basePath = "../client/src/";//生成文件放置的路径
let reCreate = true;//已有的文件是否重新创建，暂未打算支持， 可扩展

//文件路径不统一覆盖
for(let key in pageList){
    let _key = pageList[key]
    if (fs.existsSync(basePath+"pages/"+_key.name)) {
        console.log("已创建过"+basePath+ _key.name+"目录");
    } else {
        fs.mkdir(basePath+"pages/"+_key.name,function () {
            console.log('目录'+basePath+"pages/"+_key.name+'已创建成功\n');

            //生成模版文件
            let js_template="";
            let less_template="";
            let tpl_html_template ="<div id='mainPage'></div>"
            fs.writeFile(basePath+"pages/"+_key.name+"/"+_key.name+".js", js_template, function (err) {
                if (err) throw err;
            });
            fs.writeFile(basePath+"pages/"+_key.name+"/"+_key.name+".less", less_template, function (err) {
                if (err) throw err;
            });
            fs.writeFile(basePath+"pages/"+_key.name+"/tpl."+_key.name+".html", tpl_html_template, function (err) {
                if (err) throw err;
            });

        });



    }
}


//console.log(pageList);

//模版文件统一重新覆盖
for (let key in pageList) {
    let _key = pageList[key];
    
    //打包组件模版
    let other = "";
    let otherCSS = "";
    let arrCompList = pageList[key].components;

    for(let comp in arrCompList){
	
	    let cpName = arrCompList[comp];
	    let cmPath = developPath+"component/"+cpName+"/"+cpName;
	    otherCSS+="<link rel='stylesheet' href='"+"component/"+cpName+"/"+cpName+".css'/>"
		other+="<script type='text/javascript' src='"+"component/"+cpName+"/"+cpName+".js'></script>";
		
	    fs.readFile(cmPath+".htm","utf8",function (error,data){
	    	
	    	//组件模版
		     other+= "\n<script type='text/template' id='"+cpName+"-template'>\n";
		     other+= data;
		     other+="\n</script>";
		     
		    //拼接模版
		    let template =
			    "<html>\n" +
			    "<head>\n" +
			    otherCSS +
			    "<title>" + _key.title + "</title>\n" +
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
		    fs.writeFile(basePath + _key.name + ".html", template, function (err) {
			    if (err) throw err;
		    });
		    console.log("生成模版"+basePath + _key.name + ".html");
	     });
    }
	
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

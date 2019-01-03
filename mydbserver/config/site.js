var siteTitle = '多人博客', //站点名称
    pageTitle = { //各页面名称
            '/': 'HOME',
            '/index': 'HOME',
            '/reg': 'REGISTER',
            '/post': 'WRITE',
            '/upload': 'UPLOAD',
            '/logout': 'LOGOUT',
            '/vedio': 'VEDIO'
    },
    basePath = 'http://www.baidu.com';  //设置页面根路径
       
module.exports = { //对外开放配置
    siteTitle: siteTitle,
    pageTitle: pageTitle,
    basePath: basePath, 
    setting: function( req, path, file ){
            return {
                title:       pageTitle[ req.path ] + '-' + siteTitle, //组成当前页面标题
                basePath:    basePath,
                currentPage: ( path || '' ) + ( file || req.path.replace(/(\/[a-z|A-Z]*)?$/,function($1){return $1 + $1}) ), //据当前访问路径生成静态文件路径
           }
    }
}
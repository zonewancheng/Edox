var log4js = require( 'log4js' );
    //引入log4js

var logConfig = {
    //设置配置项
    "appenders":[
        {"type": "console","category":"console"},
        {
            "type": "dateFile",
            "filename":"./log/", //目录
            "pattern":"yyyyMMdd.log", //命名规则，我们是按天，也可以设置为yyyyMMddhh.log，为按时
            "absolute":true,
            "alwaysIncludePattern":true,
            "category":"logInfo"
        }
    ],
    "levels":{"logInfo":"DEBUG"}
};

log4js.configure( logConfig );
var logInfo = log4js.getLogger('logInfo');

module.exports = {
    logInfo: logInfo
}

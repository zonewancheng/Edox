var  multer  = require('multer');
var  mkdirp  = require('mkdirp');
var  fs      = require('fs');
var storage  = multer.diskStorage({
        //设置上传后文件路径，uploads文件夹会自动创建。
        destination: (req, file, cb) => {
        // 生成目标文件夹
        var destDir = 'upload/imgs/';
// 判断文件夹是否存在
fs.stat(destDir, (err) => {
    if (err) {
        // 创建文件夹
        mkdirp(destDir, (err) => {
            if (err) {
                cb(err);
            } else {
                cb(null, destDir);
    }
    });
    } else {
        cb(null, destDir);
}
});
},
//给上传文件重命名，获取添加后缀名
filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    //cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    cb(null, fileFormat[0] + '-' + Date.now().toString() + "." + fileFormat[fileFormat.length - 1] );//使用自动添加后缀名防止覆盖
    //cb(null, file.originalname );//使用原图名字，有可能覆盖
}
});
//添加配置文件到muler对象。
var upload = multer({
    storage: storage
});

//如需其他设置，请参考multer的limits,使用方法如下。
//var upload = multer({
//    storage: storage,
//    limits:{}
// });

//导出对象
module.exports = upload;
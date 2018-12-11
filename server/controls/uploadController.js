var muliter = require('../utils/multerUtil');
    //multer有single()中的名称必须是表单上传字段的name名称。
    //muilter.single(‘file’), //适用于单文件上传
		//muilter.array(‘file’,num), //适用于多文件上传，num为最多上传个数，上传文件的数量可以小于num,
		//muilter.fields(fields), //适用于混合上传，比如A类文件1个，B类文件2个。官方API有详细说明。
var upload=muliter.array('upload',10);            

exports.dataInput = function (req, res) {
    upload(req, res, function (err) {
        //添加错误处理
          if (err) {
               return  console.log(err);
          } 
        //文件信息在req.file或者req.files中显示。
        //调用方式：![Alt text](/imgs/git-1478399278436.jpg)
          console.log(req.files);
          req.flash('success', '文件上传成功!');
  		  res.redirect('/upload');
    });
 }
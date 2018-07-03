/*
 * @Author: zone
 * @Date:   2015-05-16 10:25:09
 * @Last Modified by:   zone
 * @Last Modified time: 2017-05-16 16:27:54
 */
var gulp = require('gulp'); //  引入 gulp
var less = require('gulp-less');
var runSequence = require('run-sequence'); //让gulp任务，可以相互独立，解除任务间的依赖，增强task复用
var browserSync = require('browser-sync').create(); // browser-sync 实时刷新
var sourcemaps = require('gulp-sourcemaps'); // 源码压缩之后不易报错定位  sourcemaps用于错误查找

var jshint = require("gulp-jshint");//gulp jshint 插件主要用于检查代码，打印报告信息。
var stylish = require("jshint-stylish");

//当发生异常时提示错误 确保本地安装gulp-notify和gulp-plumber
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var env = require("babel-preset-env");
var minifycss = require('gulp-minify-css'); // 压缩css
var rpath = require("path");
var autoprefixer = require('gulp-autoprefixer'); // 处理浏览器私有前缀
var babel = require('gulp-babel'); // 编译ES6语法
var $ = require('gulp-load-plugins')();
var uglify = require('gulp-uglify'); // 压缩js

var concat = require('gulp-concat');//合并js
var htmlmin = require('gulp-htmlmin');

var fs = require('fs');
var del = require('del');
var promise = require('promise');
var imagemin = require('gulp-imagemin'); // 压缩图片
var contentIncluder = require('gulp-content-includer'); //通过includer导入方式导入不同的模块
var cache = require('gulp-cache'); //清除缓存
var rev = require('gulp-rev-append'); //添加MD5
var postcss = require('gulp-postcss'); //处理css
var cssnext = require('cssnext'); //使用CSS未来的语法
var precss = require('precss'); //编写Sass的函数

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

var developPath = "../src/";
var buildPath = "../dist/";
var clean = require('gulp-clean');

var replace = require('gulp-replace');
var through = require('through2');
var version = new Date().getTime();
var proxy = require('http-proxy-middleware');


//获取文件夹下所有的文件名字并返回一个数组
var readFileNameList = function (path) {
    var result = [];

    function finder(path) {
        var files = fs.readdirSync(path);
        files.forEach(function (val, index) {
            var fPath = rpath.join(path, val);
            var stats = fs.statSync(fPath);
            if (stats.isDirectory()) finder(fPath);
            if (stats.isFile()) result.push(fPath.toString().split("\\").join("/"));
        });

    }

    finder(path);
    console.log(result);
    return result;
}

// 打包项目所需要的模块
gulp.task('pkg', function () {
    return;
})


// 编译less,并压缩css输出到目标目录
gulp.task('css', function () {
    return gulp.src(developPath + "css/**")
        //.pipe(sourcemaps.init())
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
        .pipe(less())
        .pipe(minifycss())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(buildPath + "css/"))
})

// 编译less,并压缩css输出到目标目录
gulp.task('css-dev', function () {
    return gulp.src(developPath + "css/**")
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
        .pipe(less())
        .pipe(gulp.dest(buildPath + "css/"))

})
// 编译less,并压缩css输出到目标目录
gulp.task('pages-css-dev', function () {
    return gulp.src(developPath + "pages/**/*.less")
        .pipe(less())
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
        .pipe(through.obj(function (file, enc, cb) {
            var name = rpath.basename(file.path);
            var css_filename = name.split(".")[0];
            var content = file.contents.toString();
            fs.writeFile("../dist/css/"+css_filename+".css",content,function () {

            });
            cb()
        }))
})
// 编译less,并压缩css输出到目标目录
gulp.task('pages-css', function () {
    return gulp.src(developPath + "pages/**/*.less")
        //.pipe(sourcemaps.init())
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
        .pipe(less())
        .pipe(minifycss())
        //.pipe(sourcemaps.write())
        .pipe(through.obj(function (file, enc, cb) {
            var name = rpath.basename(file.path);
            var css_filename = name.split(".")[0];
            var content = file.contents.toString();
            fs.writeFile("../dist/css/"+css_filename+".css",content,function () {

            });
            cb()
        }))
})
// 编译less,并压缩css输出到目标目录
gulp.task('css-dev', function () {
    return gulp.src(developPath + "css/**")
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
        .pipe(less())
        .pipe(gulp.dest(buildPath + "css/"))
})

// 编译less,并压缩css输出到目标目录
gulp.task('static', function () {
    return gulp.src(developPath + "static/**")
        .pipe(sourcemaps.init())
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
        .pipe(less())
        .pipe(minifycss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildPath + "static/"))
})

// 编译less,并压缩css输出到目标目录
gulp.task('static-dev', function () {
    return gulp.src(developPath + "static/**")
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
        .pipe(less())
        .pipe(gulp.dest(buildPath + "static/"))
})

// 编译ES6到ES5,并压缩js 输出到目标目录
gulp.task('js', function () {
    return gulp.src((developPath + 'js/**'))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: [env]
        }))
        .pipe(jshint(".jshintrc"))  /*Jshint可在package.json配置，也可在.jshintrc处配置。默认在单独文件中配置*/
        .pipe(jshint.reporter("default"))
        .pipe(jshint.reporter(stylish))
        .pipe(uglify({mangle: false}))
        //.pipe(sourcemaps.write())
        .on('error', function (e) {
            console.log(e);
        })
        .pipe(gulp.dest(buildPath + "js/"))

});

gulp.task('js-dev', function () {
    return gulp.src((developPath + 'js/**'))
        .pipe(babel({
            presets: [env]
        }))
        .pipe(gulp.dest(buildPath + "js/"))
});

gulp.task('pages-js-dev', function () {
    return gulp.src((developPath + 'pages/**/*.js'))
        .pipe(babel({
            presets: [env]
        }))
        .pipe(through.obj(function (file, enc, cb) {
            var name = rpath.basename(file.path);
            var js_filename = name.split(".")[0];
            var content = file.contents.toString();
            fs.writeFile("../dist/js/"+js_filename+".js",content,function () {

            });
            cb()
        }))
});
gulp.task('pages-js', function () {
    return gulp.src((developPath + 'pages/**/*.js'))
        //.pipe(sourcemaps.init())
        .pipe(babel({
            presets: [env]
        }))
        .pipe(jshint(".jshintrc"))  /*Jshint可在package.json配置，也可在.jshintrc处配置。默认在单独文件中配置*/
        //.pipe(jshint.reporter("default"))
        .pipe(jshint.reporter(stylish))
        .pipe(uglify({mangle: false}))
        //.pipe(sourcemaps.write())
        .on('error', function (e) {
            console.log(e);
        })
        .pipe(through.obj(function (file, enc, cb) {
            var name = rpath.basename(file.path);
            var js_filename = name.split(".")[0];
            var content = file.contents.toString();
            fs.writeFile("../dist/js/"+js_filename+".js",content,function () {

            });
            cb()
        }))
});
// 拷贝 html
gulp.task('html', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    return gulp.src([developPath + '*.html'])
        .pipe(through.obj(function (file, enc, cb) {
            var name = rpath.basename(file.path);
            name = "<link rel='stylesheet' href='" + 'css/' + name.split(".")[0] + '.css?v='+version + "'>";
            var content = file.contents.toString();
            content = content.replace('<!--_HEAD_CONTAINER_-->', name);
            file.contents = new Buffer(content);
            this.push(file);
            cb();
        }))
        .pipe(through.obj(function (file, enc, cb) {
            var name = rpath.basename(file.path);
            //console.log("path: "+name)
            name = "../src/pages/"+name.split(".")[0]+"/tpl."+name.split(".")[0]+".html";
            var that = this;
            //console.log(process.cwd())
            fs.readFile(name,"utf8",function (err,txt) {
                if(err){
                    console.warn(name+" 不存在已跳过")
                }else{
                    //console.log(txt)
                    var content = file.contents.toString();
                    content = content.replace('<!--_BODY_CONTAINER_-->', txt);
                    file.contents = new Buffer(content);
                    that.push(file);
                }
                cb();
            })
        }))
        .pipe(through.obj(function (file, enc, cb) {
            var name = rpath.basename(file.path);
            name = "<script async defer src='" + 'js/' + name.split(".")[0] + '.js?v='+version + "'></script>";
            var content = file.contents.toString();
            content = content.replace('<!--_FOOT_CONTAINER_-->', name);
            file.contents = new Buffer(content);
            this.push(file);
            cb();
        }))
        .pipe(through.obj(function (file, enc, cb) {
            var name = rpath.basename(file.path);
            name = "<script async defer src='" + 'js/points.js?v='+version + "'></script>";
            var content = file.contents.toString();
            content = content.replace('<!--_OTHER_CONTAINER_-->', name);
            file.contents = new Buffer(content);
            this.push(file);
            cb();
        }))
        .pipe(htmlmin(options))
        .pipe(gulp.dest(buildPath))
});

function htmlReplace(str, name) {
    console.log(name)
    return replace(str, name);

}

gulp.task('html-dev', function () {
    return gulp.src([developPath + '*.html'])
        .pipe(through.obj(function (file, enc, cb) {
            var name = rpath.basename(file.path);
            name = "<link rel='stylesheet' href='" + 'css/' + name.split(".")[0] + '.css?v='+version + "'>";
            var content = file.contents.toString();
            content = content.replace('<!--_HEAD_CONTAINER_-->', name);
            file.contents = new Buffer(content);
            this.push(file);
            cb();
        }))
        .pipe(through.obj(function (file, enc, cb) {
            var name = rpath.basename(file.path);
            //console.log("path: "+name)
            name = "../src/pages/"+name.split(".")[0]+"/tpl."+name.split(".")[0]+".html";
            var that = this;
            //console.log(process.cwd())
            fs.readFile(name,"utf8",function (err,txt) {
                if(err){
                    console.warn(name+".html"+" 不存在已跳过")
                }else{
                    //console.log(txt)
                    var content = file.contents.toString();
                    content = content.replace('<!--_BODY_CONTAINER_-->', txt);
                    file.contents = new Buffer(content);
                    that.push(file);
                }
                cb();
            })

        }))
        .pipe(through.obj(function (file, enc, cb) {
            var name = rpath.basename(file.path);
            name = "<script async defer src='" + 'js/' + name.split(".")[0] + '.js?v='+version + "'></script>";
            var content = file.contents.toString();
            content = content.replace('<!--_FOOT_CONTAINER_-->', name);
            file.contents = new Buffer(content);
            this.push(file);
            cb();
        }))
        .pipe(through.obj(function (file, enc, cb) {
            var name = rpath.basename(file.path);
            name = "<script async defer src='" + 'js/points.js?v='+version + "'></script>";
            var content = file.contents.toString();
            content = content.replace('<!--_OTHER_CONTAINER_-->', name);
            file.contents = new Buffer(content);
            this.push(file);
            cb();
        }))
        .pipe(gulp.dest(buildPath))
});
// gulp.task('pages-dev',function () {
//     return gulp.src([developPath + '/pages/**/*.html'])
//         .pipe(through.obj(function (file, enc, cb) {
//
//         }))
//
// });
// 图片压缩  输出到目标目录
gulp.task('images', function () {
    return gulp.src([developPath + 'imgs/*.*'])
        .pipe(imagemin())
        .pipe(gulp.dest(buildPath + "imgs/"))
});

// 图片压缩  输出到目标目录
gulp.task('images-dev', function () {
    return gulp.src([developPath + 'imgs/*.*'])
        .pipe(gulp.dest(buildPath + "imgs/"))
});

// 框架依赖  输出到目标目录
gulp.task('Edox', function () {
    return gulp.src([developPath + 'Edox/**'])
        .pipe(babel({
            presets: [env]
        }))
        .pipe(jshint(".jshintrc"))
        //.pipe(jshint.reporter("default"))
        .pipe(jshint.reporter(stylish))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest(buildPath + "Edox/"))
});

// 框架依赖  输出到目标目录
gulp.task('Edox-dev', function () {
    return gulp.src([developPath + 'Edox/**'])
});

gulp.task('js-dev', function () {
    return gulp.src((developPath + 'js/**'))
        // .pipe(babel({
        //     presets: [env]
        // }))
        .pipe(gulp.dest(buildPath + "js/"))
});


// 图片压缩  输出到目标目录
gulp.task('images', function () {
    return gulp.src([developPath + 'imgs/*.*'])
        .pipe(imagemin())
        .pipe(gulp.dest(buildPath + "imgs/"))
});

// 图片压缩  输出到目标目录
gulp.task('images-dev', function () {
    return gulp.src([developPath + 'imgs/*.*'])
        .pipe(gulp.dest(buildPath + "imgs/"))
});

// 框架依赖  输出到目标目录
gulp.task('Edox', function () {
    return gulp.src([developPath + 'Edox/*.js'])
        .pipe(babel({
            presets: [env]
        }))
        .pipe(jshint(".jshintrc"))
        //.pipe(jshint.reporter("default"))
        .pipe(jshint.reporter(stylish))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest(buildPath + "Edox/"))
});

// 框架依赖  输出到目标目录
gulp.task('Edox-dev', function () {
    return gulp.src([developPath + 'Edox/*.js'])
        .pipe(babel({
            presets: [env]
        }))
        .pipe(gulp.dest(buildPath + "Edox/"))
});

gulp.task('clean', function () {
    var filePathList = readFileNameList(buildPath);
    for (var i = 0; i < filePathList.length; i++) {
        fs.unlink(filePathList[i],function (err) {
            if(err){}
        });
    }
    return true;
})
gulp.task('reload', function () {
    browserSync.reload(buildPath);
    //console.log("reload complete at " + new Date().toString());
})

// 静态服务器 + 监听 less/html/js/images/Edox框架源文件
var proxy_middleware = proxy({
    target: 'http://localhost',
    changeOrigin: true,
    pathRewrite: {
        'http://localhost' : 'http://dev.xicer.com'
    },
    router: {
        // when request.headers.host == 'dev.localhost:3000',
        // override target 'http://www.example.org' to 'http://localhost:8000'
        'http://localhost:3000' : 'http://dev.xicer.com'
    }
});

gulp.task('server', function () {
    browserSync.init({
        server: buildPath,
        index:"index.html",
        //https:true,
        //middleware:[proxy_middleware]

    });
    gulp.watch(developPath + "**/*").on('change', function () {
        runSequence("clean", ["css-dev", "html-dev", "js-dev","pages-js-dev","pages-css-dev","images-dev"], "reload");
    });
});


//本地开发执行默认任务
gulp.task('default', function () {
    runSequence("clean", ["css-dev", "html-dev", "js-dev","pages-js-dev","pages-css-dev", "images-dev"], "server");
});

//执行打包发布任务(不压缩)
gulp.task('develop', function () {
    runSequence("clean", ["css-dev", "html-dev", "js-dev","pages-js-dev","pages-css-dev", "images-dev"]);
});

//执行打包发布任务
gulp.task('product', function () {
    runSequence("clean", ["html", "css", "js","pages-js" ,"pages-css","images"]);
});


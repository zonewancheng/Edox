/*
 * @Author: fishCat
 * @Date:   2015-05-16 10:25:09
 * @Last Modified by:   oospace
 * @Last Modified time: 2017-05-16 16:27:54
 */
var gulp = require('gulp'); //  引入 gulp
var less = require('gulp-less');
var runSequence = require('run-sequence'); //让gulp任务，可以相互独立，解除任务间的依赖，增强task复用
var browserSync = require('browser-sync').create(); // browser-sync 实时刷新
var sourcemaps = require('gulp-sourcemaps'); // 源码压缩之后不易报错定位  sourcemaps用于错误查找

var jshint = require("gulp-jshint");//gulp jshint 插件主要用于检查代码，打印报告信息。

//当发生异常时提示错误 确保本地安装gulp-notify和gulp-plumber
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var es2015= require("babel-preset-es2015");
var minifycss = require('gulp-minify-css'); // 压缩css
var rpath = require("path");
var autoprefixer = require('gulp-autoprefixer'); // 处理浏览器私有前缀
var babel = require('gulp-babel'); // 编译ES6语法
var $ = require('gulp-load-plugins')();
var uglify = require('gulp-uglify'); // 压缩js

var concat = require('gulp-concat');//合并js
var  htmlmin=require('gulp-htmlmin');

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

var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

var developPath = "../src/";
var buildPath = "../dist/";
var clean = require('gulp-clean');
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

// 编译less,并压缩css输出到目标目录
gulp.task('css', function () {
    gulp.src(developPath + "css/**")
        .pipe(sourcemaps.init())
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(less())
        .pipe(minifycss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildPath + "css/"))
})

// 编译ES6到ES5,并压缩js 输出到目标目录
gulp.task('js', function () {
    gulp.src((developPath + 'js/**'))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: [es2015]
        }))
        .pipe(jshint())
        .pipe(jshint.reporter("default"))
        .pipe(uglify({mangle: false}))
        .pipe(sourcemaps.write())
        .on('error', function (e) {
            console.log(e);
        })
        .pipe(gulp.dest(buildPath+"js/"))
});

// 拷贝 html
gulp.task('html', function () {
    gulp.src([developPath + '*.html'])
        .pipe(htmlmin())
        .pipe(gulp.dest(buildPath))
});

// 图片压缩  输出到目标目录
gulp.task('images', function () {
    gulp.src([developPath + 'imgs/*.*'])
        .pipe(gulp.dest(buildPath))
});


gulp.task('clean', function () {
    var filePathList = readFileNameList(buildPath);
    for (var i = 0; i < filePathList.length; i++) {
        fs.unlink(filePathList[i]);
    }
})

// 静态服务器 + 监听 scss/html/js/images 文件
gulp.task('server', function () {
    browserSync.init({
        server: buildPath,
    });

    gulp.watch(developPath + "**/*").on('change', function () {
        runSequence( 'css', "html", "js", "images", function () {

            browserSync.reload(buildPath);
            console.log("reload complete at " + new Date().toString());

        });
    });
});


//执行默认任务
/*gulp.task('default', function () {
 runSequence("clean", "css", "html", "js", "images", "server");
 });*/

//执行发布任务
gulp.task('default', function () {
    runSequence("clean","html","css", "js","images");
});
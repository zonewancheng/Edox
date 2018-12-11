/*
 * @Author: zone
 * @Date:   2015-05-16 10:25:09
 * @Last Modified by:   zone
 * @Last Modified time: 2017-05-16 16:27:54
 */
let gulp = require('gulp'); //  引入 gulp
let less = require('gulp-less');
let runSequence = require('run-sequence'); //让gulp任务，可以相互独立，解除任务间的依赖，增强task复用
let browserSync = require('browser-sync').create(); // browser-sync 实时刷新
let sourcemaps = require('gulp-sourcemaps'); // 源码压缩之后不易报错定位  sourcemaps用于错误查找

let jshint = require("gulp-jshint");//gulp jshint 插件主要用于检查代码，打印报告信息。
let stylish = require("jshint-stylish");

//当发生异常时提示错误 确保本地安装gulp-notify和gulp-plumber
let notify = require('gulp-notify');
let plumber = require('gulp-plumber');
let env = require("babel-preset-env");
let minifycss = require('gulp-minify-css'); // 压缩css
let rpath = require("path");
//let autoprefixer = require('gulp-autoprefixer'); // 处理浏览器私有前缀
let babel = require('gulp-babel'); // 编译ES6语法
let $ = require('gulp-load-plugins')();
let uglify = require('gulp-uglify'); // 压缩js

let concat = require('gulp-concat');//合并js
let htmlmin = require('gulp-htmlmin');

let fs = require('fs');
let del = require('del');
let promise = require('promise');
let imagemin = require('gulp-imagemin'); // 压缩图片
let contentIncluder = require('gulp-content-includer'); //通过includer导入方式导入不同的模块
let cache = require('gulp-cache'); //清除缓存
let rev = require('gulp-rev-append'); //添加MD5
let postcss = require('gulp-postcss'); //处理css
let cssnext = require('cssnext'); //使用CSS未来的语法
let precss = require('precss'); //编写Sass的函数

//let postcss = require('gulp-postcss');
let autoprefixer = require('autoprefixer');

let developPath = "../client/src/";
let buildPath = "../client/dist/";
let clean = require('gulp-clean');

let replace = require('gulp-replace');
let through = require('through2');
let version = new Date().getTime();
let proxy = require('http-proxy-middleware');

let rename    = require('gulp-rename');
let VueModule = require('gulp-vue-module');
let vueify = require('gulp-vueify');


//获取文件夹下所有的文件名字并返回一个数组
let readFileNameList = function (path) {
    let result = [];

    function finder(path) {
        let files = fs.readdirSync(path);
        files.forEach(function (val, index) {
            let fPath = rpath.join(path, val);
            let stats = fs.statSync(fPath);
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
            let name = rpath.basename(file.path);
            let css_filename = name.split(".")[0];
            let content = file.contents.toString();
            fs.writeFile(buildPath+"/css/"+css_filename+".css",content,function () {

            });
            cb()
        }))
})


// 编译less,并压缩css输出到目标目录
gulp.task('comp-css-dev', function () {
	return gulp.src(developPath + "component/**/*.less")
		.pipe(less())
		.pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
		.pipe(through.obj(function (file, enc, cb) {
			let name = rpath.basename(file.path);
			let css_filename = name.split(".")[0];
			let content = file.contents.toString();
			fs.writeFile(buildPath+"/component/"+css_filename+"/"+css_filename+".css",content,function () {
			
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
            let name = rpath.basename(file.path);
            let css_filename = name.split(".")[0];
            let content = file.contents.toString();
            fs.writeFile(buildPath+"/css/"+css_filename+".css",content,function () {

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

gulp.task('comp-js', function () {
	return gulp.src((developPath + 'component/**/*.js'))
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
		.pipe(gulp.dest(buildPath + "component/"))
	
});
gulp.task('js-dev', function () {
    return gulp.src((developPath + 'js/**'))
        .pipe(babel({
            presets: [env]
        }))
        .pipe(gulp.dest(buildPath + "js/"))
});

gulp.task('comp-js-dev', function () {
	return gulp.src((developPath + 'component/**/*.js'))
		.pipe(babel({
			presets: [env]
		}))
		.pipe(through.obj(function (file, enc, cb) {
			let name = rpath.basename(file.path);
			let js_filename = name.split(".")[0];
			let content = file.contents.toString();
			fs.writeFile(buildPath+"component/"+js_filename+"/"+js_filename+".js",content,function () {
			
			});
			cb()
		}))
});

gulp.task('pages-js-dev', function () {
    return gulp.src((developPath + 'pages/**/*.js'))
        .pipe(babel({
            presets: [env]
        }))
        .pipe(through.obj(function (file, enc, cb) {
            let name = rpath.basename(file.path);
            let js_filename = name.split(".")[0];
            let content = file.contents.toString();
            fs.writeFile(buildPath+"/js/"+js_filename+".js",content,function () {

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
            let name = rpath.basename(file.path);
            let js_filename = name.split(".")[0];
            let content = file.contents.toString();
            fs.writeFile(buildPath+"/js/"+js_filename+".js",content,function () {

            });
            cb()
        }))
});
// 拷贝 html
gulp.task('html', function () {
    let options = {
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
            let name = rpath.basename(file.path);
            name = "<link rel='stylesheet' href='" + 'css/' + name.split(".")[0] + '.css?v='+version + "'>";
            let content = file.contents.toString();
            content = content.replace('<!--_HEAD_CONTAINER_-->', name);
            file.contents = new Buffer(content);
            this.push(file);
            cb();
        }))
        .pipe(through.obj(function (file, enc, cb) {
            let name = rpath.basename(file.path);
            //console.log("path: "+name)
            name = developPath+"/pages/"+name.split(".")[0]+"/tpl."+name.split(".")[0]+".html";
            let that = this;
            //console.log(process.cwd())
            fs.readFile(name,"utf8",function (err,txt) {
                if(err){
                    console.warn(name+" 不存在已跳过")
                }else{
                    //console.log(txt)
                    let content = file.contents.toString();
                    content = content.replace('<!--_BODY_CONTAINER_-->', txt);
                    file.contents = new Buffer(content);
                    that.push(file);
                }
                cb();
            })
        }))
        .pipe(through.obj(function (file, enc, cb) {
            let name = rpath.basename(file.path);
            name = "<script async defer src='" + 'js/' + name.split(".")[0] + '.js?v='+version + "'></script>";
            let content = file.contents.toString();
            content = content.replace('<!--_FOOT_CONTAINER_-->', name);
            file.contents = new Buffer(content);
            this.push(file);
            cb();
        }))
        .pipe(through.obj(function (file, enc, cb) {
            let name = rpath.basename(file.path);
            name = "<script async defer src='" + 'js/points.js?v='+version + "'></script>";
            let content = file.contents.toString();
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
            let name = rpath.basename(file.path);
            name = "<link rel='stylesheet' href='" + 'css/' + name.split(".")[0] + '.css?v='+version + "'>";
            let content = file.contents.toString();
            content = content.replace('<!--_HEAD_CONTAINER_-->', name);
            file.contents = new Buffer(content);
            this.push(file);
            cb();
        }))
        .pipe(through.obj(function (file, enc, cb) {
            let name = rpath.basename(file.path);
            //console.log("path: "+name)
            name = developPath+"/pages/"+name.split(".")[0]+"/tpl."+name.split(".")[0]+".html";
            let that = this;
            //console.log(process.cwd())
            fs.readFile(name,"utf8",function (err,txt) {
                if(err){
                    console.warn(name+".html"+" 不存在已跳过")
                }else{
                    //console.log(txt)
                    let content = file.contents.toString();
                    content = content.replace('<!--_BODY_CONTAINER_-->', txt);
                    file.contents = new Buffer(content);
                    that.push(file);
                }
                cb();
            })

        }))
        .pipe(through.obj(function (file, enc, cb) {
            let name = rpath.basename(file.path);
            name = "<script async defer src='" + 'js/' + name.split(".")[0] + '.js?v='+version + "'></script>";
            let content = file.contents.toString();
            content = content.replace('<!--_FOOT_CONTAINER_-->', name);
            file.contents = new Buffer(content);
            this.push(file);
            cb();
        }))
        .pipe(through.obj(function (file, enc, cb) {
            let name = rpath.basename(file.path);
            name = "<script async defer src='" + 'js/points.js?v='+version + "'></script>";
            let content = file.contents.toString();
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
gulp.task('edox', function () {
    return gulp.src([developPath + 'edox/**'])
        .pipe(babel({
            presets: [env]
        }))
        .pipe(jshint(".jshintrc"))
        //.pipe(jshint.reporter("default"))
        .pipe(jshint.reporter(stylish))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest(buildPath + "edox/"))
});

// 框架依赖  输出到目标目录
gulp.task('edox-dev', function () {
    return gulp.src([developPath + 'edox/**'])
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
gulp.task('edox', function () {
    return gulp.src([developPath + 'edox/*.js'])
        .pipe(babel({
            presets: [env]
        }))
        .pipe(jshint(".jshintrc"))
        //.pipe(jshint.reporter("default"))
        .pipe(jshint.reporter(stylish))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest(buildPath + "edox/"))
});

// 框架依赖  输出到目标目录
gulp.task('edox-dev', function () {
    return gulp.src([developPath + 'edox/*.js'])
        .pipe(babel({
            presets: [env]
        }))
        .pipe(gulp.dest(buildPath + "edox/"))
});

//打包vue组件
gulp.task('vue', function() {
	return gulp.src(developPath+'/component/**/*.vue')
		.pipe(VueModule({
			debug : true
		}))
		.pipe(rename({extname : ".js"}))
		.pipe(gulp.dest(developPath+"component/"));
});
//打包vue组件
gulp.task('vueify', function () {
	return gulp.src(developPath+'component/**/*.vue')
		.pipe(vueify())
		.pipe(gulp.dest(developPath+"component/"));
});
gulp.task('clean', function () {
    let filePathList = readFileNameList(buildPath);
    for (let i = 0; i < filePathList.length; i++) {
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

// 静态服务器 + 监听 less/html/js/images/edox框架源文件
let proxy_middleware = proxy({
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
        runSequence("clean", ["comp-css-dev","css-dev", "html-dev","comp-js-dev", "js-dev","pages-js-dev","pages-css-dev","images-dev"], "reload");
    });
});

//本地开发执行测试打包任务
gulp.task('test', function () {
	runSequence("vueify");
});

//本地开发执行默认任务
gulp.task('default', function () {
    runSequence("clean", ["comp-css-dev","css-dev", "html-dev", "comp-js-dev","js-dev","pages-js-dev","pages-css-dev", "images-dev"], "server");
});

//执行打包发布任务(不压缩)
gulp.task('develop', function () {
    runSequence("clean", ["css-dev", "html-dev", "js-dev","pages-js-dev","pages-css-dev", "images-dev"]);
});

//执行打包发布任务
gulp.task('product', function () {
    runSequence("clean", ["html", "css", "js","pages-js" ,"pages-css","images"]);
});


var express        = require('express');
var fs             = require('fs');
var accessLog      = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog       = fs.createWriteStream('error.log',  {flags: 'a'});
var app            = express();
var crypto         = require('crypto');
var User           = require('./model/user.js');
var routes         = require( './routes' );
var settings       = require('./db/settings');
var flash          = require('connect-flash');
var logger         = require( 'morgan' );
var bodyParser     = require( 'body-parser' );
var methodOverride = require( 'method-override' );
var http           = require( 'http' );
var path           = require( 'path' );
var mongoose       = require( 'mongoose' );
var cookieParser   = require('cookie-parser');
var session        = require('express-session');
var MongoStore     = require('connect-mongo')(session);
var favicon        = require('serve-favicon');
var colors         = require( 'colors' );
var errorHandler   = require('errorhandler');
var server         = http.Server( app );

// view engine setup
app.set( 'port', process.env.PORT || 3000 ); //服务启动端口
//定义ejs模板引擎和模板文件位置
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );

//页面通知（即成功与错误信息的显示）的功能
app.use(flash());
app.use( express.static( path.join( __dirname, 'public' ))); //静态文件路径
app.use( express.static( path.join( __dirname, 'upload' ))); //静态文件路径
//记录错误日志
app.use(function(err, req, res, next){
    var meta = '['+ new Date() +']' + req.url + '\n';
    errorLog.write(meta + err.stack + '\n');
    next();
});
//定义icon图标
//app.use(favicon(__dirname + '/public/imgs/favicon.ico'));
//定义日志和输出级别
app.use(logger('dev'));
app.use(logger({stream: accessLog}));
//定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,
  cookie: {maxAge: 1000 * 60 * 60 }, 
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
  	db:   settings.db,
  	url: 'mongodb://'+settings.host+':'+settings.port+'/'+settings.db,
    host: settings.host,
    port: settings.port
  })
}));

app.use(function(req, res, next){
  res.locals.user = req.session.user;
  var err = req.session.error;
  res.locals.message = '';
  if (err) res.locals.message = '<div style="margin-bottom: 20px;color:red;">' + err + '</div>';
  next();
});

//定义cookie解析器
app.use(cookieParser());

app.use(methodOverride());

routes.all( app );

if('development' == app.get('env')){
  app.use(errorHandler());
}

server.listen( app.get( 'port' ), function(){                     //监听服务端口
    console.log( 'root server listening on port ' + app.get( 'port' ),app.settings.env);
});

module.exports = app;

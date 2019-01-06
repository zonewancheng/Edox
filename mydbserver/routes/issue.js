var crypto = require('crypto');
//var flash  = require('connect-flash');
var site   = require('../config/site.js');
var user   = require('../controls/user.js');
var User   = require('../models/user.js');


function login( req, res ){                               //定义登录转向
    res.render( 'login', {
        title: '登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}

function loginUser( req, res ){                        //定义登录转向
    var password   = crypto.createHash('md5').update(req.body.password).digest('hex').toUpperCase();
    //检查用户是否存在
    User.get(req.body.username, function (err, user) {
        if (!user) {
          req.flash('error', '用户不存在!');
          return res.redirect('/login');              //用户不存在则跳转到登录页
        }
        //检查密码是否一致
        if (user.password != password) {
          req.flash('error', '密码错误!');
          return res.redirect('/login');             //密码错误则跳转到登录页
        }
        //用户名密码都匹配后，将用户信息存入 session
        req.session.user = user;
        req.flash('success', '登陆成功!');
        res.redirect('/');                          //登陆成功后跳转到主页
    });
}

function reg( req, res ){                                //定义注册转向
    res.render( 'issue/reg', {
        title: '注册',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}

function registerUser( req, res ){                 //定义注册转向
    var username   = req.body.username;
    var password   = req.body.password;
    var repassword = req.body.repassword;
    var email      = req.body.email;
    //检验用户两次输入的密码是否一致
    if (repassword != password) {
       req.flash('error', '两次输入的密码不一致!');
       return res.redirect('/reg');               //返回注册页
    }
    //生成密码的 md5 值
    var password   = crypto.createHash('md5').update(req.body.password).digest('hex').toUpperCase();
    var repassword = crypto.createHash('md5').update(req.body.repassword).digest('hex').toUpperCase();
    var newUser = new User({
        username: username,
        password: password,
        repassword: repassword,
        email: email
    });

    //检查用户名是否已经存在
    User.get(newUser.username, function (err, user) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/');
        }
        if (user) {
          req.flash('error', '用户已存在!');
          return res.redirect('/reg');           //返回注册页
        }
        //如果不存在则新增用户
        newUser.save(function (err, user) {
          if (err) {
            req.flash('error', err);
            return res.redirect('/reg');       //注册失败返回主册页
          }
          //req.session.user = newUser;         //用户信息存入 session
          req.session.user = user;
          req.flash('success', '注册成功!');
          res.redirect('/');                 //注册成功后返回主页
        });
    });
}

module.exports = {
	login:        login,
    reg:          reg,
    loginUser:    loginUser,
    registerUser: registerUser
}

var issue            = require('./issue');
var domain           = require( 'domain' );                //引入domain
var Domain           = domain.create();
var gravatar         = require('gravatar');              //头像
var crypto           = require('crypto');               //md5加密
//var gadget           = require( '../tool/gadget' );    //引入日志记录
var uploadController = require('../controls/uploadController');
var Post             = require('../model/post.js');
var User             = require('../model/user.js');
var Comment          = require('../model/comment.js');

Domain.on( 'error', function( e ){    //监听异步错误
    console.log( 'error ' + e)
});

exports.all = function(app){

	app.get( '/', function( req, res ){
	    var page = req.query.p ? parseInt(req.query.p) : 1;
	    Post.getTen(null, page, function(err, posts, total){
	        if(err){
	            posts = [];
	        }
	        res.render( 'issue/index', {
	            title: '首页',
	            user: req.session.user,
	            posts: posts,
	            page:  page,
	            isFirstPage: (page -1) == 0,
	            isLastPage: ((page -1) * 3 + posts.length) == total,
	            success: req.flash('success').toString(),
	            error: req.flash('error').toString()
	        });
	    });
	});

    //登录
    app.get('/login', checkNotLogin);
	app.get('/login', function(req, res) {
	    issue.login(req,res);
	});

    app.post('/login', checkNotLogin);
	app.post('/login', function(req, res) {
	    issue.loginUser( req, res );
	});

	//home
	app.get('/home', function(req, res) {
	    if(req.session.user){
	        res.render('issue/home', {title: 'home'});
	    }else{
	        req.session.error = '请先登录';
	        res.render('login', {title: '登录'});
	    }
	});

    //注册
    app.get('/reg', checkNotLogin);
	app.get('/reg', function(req, res, next) {
	    issue.reg(req,res);
	});

	app.post('/reg', checkNotLogin);
	app.post('/reg', function(req, res, next) {
		issue.registerUser(req, res);
	});

	//发表文章
	app.get('/post', checkLogin);
	app.get('/post', function(req, res) {
	    res.render('post', {
	    	title: '发表文章',
	    	user: req.session.user,
	    	success: req.flash('success').toString(),
	    	error: req.flash('error').toString()
	    });
	});

	app.post('/post', checkLogin);
	app.post('/post', function(req, res) {
	    var currentUser = req.session.user,
            tags = [req.body.tag1, req.body.tag2, req.body.tag3],
	        post = new Post(currentUser.username, currentUser.head, req.body.title, tags, req.body.post);
	    post.save(function(err){
	    	if(err){
	    		req.flash('error',err);
	    		return res.redirect('/');
	    	}
	    	req.flash('success','发表成功！');
	    	res.redirect('/');
	    });
	});

    //文件上传
    app.get('/upload', checkLogin);
	app.get('/upload', function(req, res) {
	    res.render('upload', {
	    	title: '上传',
	    	user: req.session.user,
	    	success: req.flash('success').toString(),
	    	error: req.flash('error').toString()
	    });

	});

	app.post('/upload', checkLogin);
	app.post('/upload', uploadController.dataInput);

	//退出
	app.get('/logout', checkLogin);
	app.get('/logout', function(req, res ) {
	    req.session.user = null;
	    req.session.error = null;
	    req.flash('success','退出成功！');
	    return res.redirect('/');
	});

    app.get('/links', function(req, res){
        res.render('links', {
            title: '友情链接',
            user:  req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.get('/search', function(req, res){
        Post.search(req.query.keyword, function(err, posts){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('search',{
                title: "输入关键字搜索:" +req.query.keyword,
                posts: posts,
                user:  req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

	app.get('/blog/:username', function(req, res){
		var page = parseInt(req.query.p) || 1;
		//检查用户是否存在
		User.get(req.params.username, function(err, user){
			if(!user){
				req.flash('error', '用户不存在');
				return res.redirect('/');
			}
			Post.getTen(user.username, page, function(err, posts, total){
				if(err){
					req.flash('error', err);
					return res.redirect('/');
				}
				res.render('user', {
					title: user.username,
					posts: posts,
					page:  page,
		            isFirstPage: (page -1) == 0,
		            isLastPage: ((page -1) * 3 + posts.length) == total,
					user:  req.session.user,
					success: req.flash('success').toString(),
					error:   req.flash('error').toString()
				});
			});
		});
	});

	app.get('/blog/:username/:day/:title', function(req, res){
		Post.getOne(req.params.username, req.params.day, req.params.title, function(err, post){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			res.render('article', {
				title:   req.params.title,
				post:    post,
				user:    req.session.user,
				success: req.flash('success').toString(),
				error:   req.flash('error').toString()
			});
		});
	});

	app.post('/blog/:username/:day/:title', function(req, res){

        var date = new Date(),
            time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
                   date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());

        var md5  = crypto.createHash('md5'),
       email_MD5 = md5.update(req.body.email.toLowerCase()).digest('hex'),
            head = "http://cn.gravatar.com/avatar/" + email_MD5 + "?s=48";

        var comment = {
	    	username: req.body.username,
            head:     head,
	    	email:    req.body.email,
	    	website:  req.body.website,
	    	time:     time,
	    	content:  req.body.content
	    };

	    var newComment = new Comment(req.params.username, req.params.day, req.params.title, comment);
	    newComment.save(function(err){
	    	if(err){
	    		req.flash('error', err);
	    		return res.redirect('back');
	    	}
	    	req.flash('success', '留言成功！');
	    	res.redirect('back');
	    });
	});

	app.get('/edit/:username/:day/:title', checkLogin);
	app.get('/edit/:username/:day/:title', function(req, res){
		var currentUser = req.session.user;
		Post.edit(currentUser.username, req.params.day, req.params.title, function(err, post){
			if(err){
				req.flash('error', err);
				return res.redirect('back');
			}
			res.render('edit', {
				title: '编辑',
				post: post,
				user: req.session.user,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});

	app.post('/edit/:username/:day/:title', checkLogin);
	app.post('/edit/:username/:day/:title', function(req, res){
		var currentUser = req.session.user;
		Post.update(currentUser.username, req.params.day, req.params.title, req.body.post, function(err){
			var url = encodeURI('/blog/'+ req.params.username + '/' + req.params.day + '/' + req.params.title);
			if(err){
				req.flash('error', err);
				return res.redirect(url);
			}
			req.flash('success', '修改成功!');
			res.redirect(url);
		});
	});

	app.get('/remove/:username/:day/:title', checkLogin);
	app.get('/remove/:username/:day/:title', function(req,res){
		var currentUser = req.session.user;
		Post.remove(currentUser.username, req.params.day, req.params.title, function(err){
			if(err){
				req.flash('error', err);
				return res.redirect('back');
			}
			req.flash('success', '删除成功!');
			res.redirect('/');
		});
	});

    app.get('/reprint/:username/:day/:title', checkLogin);
      app.get('/reprint/:username/:day/:title', function (req, res) {
        Post.edit(req.params.username, req.params.day, req.params.title, function (err, post) {
          if (err) {
            req.flash('error', err);
            return res.redirect('back');
          }
          var currentUser = req.session.user,
              reprint_from = { username: post.username, day: post.time.day, title: post.title},
              reprint_to   = { username: currentUser.username, head: currentUser.head};
          Post.reprint(reprint_from, reprint_to, function (err, post) {
            if (err) {
              req.flash('error', err);
              return res.redirect('back');
            }
            req.flash('success', '转载成功!');
            var url = encodeURI('/blog/' + post.username + '/' + post.time.day + '/' + post.title);
            res.redirect(url);
          });
        });
      });

    app.get('/archive', function(req, res){
        Post.getArchive(function(err, posts){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('archive', {
                title: '存档',
                posts: posts,
                user:  req.session.user,
                success: req.flash('success').toString(),
				error: req.flash('error').toString()
            });
        });
    });

    app.get('/tags', function (req, res) {
        Post.getTags(function (err, posts) {
          if (err) {
            req.flash('error', err);
            return res.redirect('/');
          }
          res.render('tags', {
            title:   '标签',
            posts:   posts,
            user:    req.session.user,
            success: req.flash('success').toString(),
            error:   req.flash('error').toString()
          });
        });
    });
	app.get('/vedio', function (req, res) {
		Post.getVedios(function (err, posts) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			res.render('vedio', {
				title:   '媒体库',
				posts:   posts,
				user:    req.session.user,
				success: req.flash('success').toString(),
				error:   req.flash('error').toString()
			});
		});
	});

    app.get('/tags/:tag', function(req, res){
        Post.getTag(req.params.tag, function(err, posts){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('tag',{
                title: 'TAG:' + req.params.tag,
                posts: posts,
                user:  req.session.user,
                success: req.flash('success').toString(),
                error:   req.flash('error').toString()
            });
        });
    });

    app.use(function(req, res){
        res.render("404");
    });

	function checkLogin(req,res,next){
		if(!req.session.user){
			req.flash('error','未登录！');
			return res.redirect('/login');
		}
		next();
	}

	function checkNotLogin(req,res,next){
		if(req.session.user){
			req.flash('error','已登录！');
			return res.redirect('back');
		}
		next();
	}

}

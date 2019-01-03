var db = require( '../db/sql' );
var crypto = require( 'crypto' );

var md5 = function(data) {
    return crypto.createHash('md5').update(data).digest('hex').toLowerCase();
}
function addUser( req, res ){
    var newdata = req.body;
    var mypassword = md5( newdata.password );
    var repassword = md5( newdata.repassword );

    var data = {
        username:   newdata.username,
        password:   mypassword,
        repassword: repassword,
        email:      newdata.email
    };
    db.addUser( data, function( err, doc ){
        if( !err ){
            res.send( { code: 0, msg: 'add User Success', data: doc } );
        }
    })
}

function findUser( req, res ){
    var newdata = req.body;
    var mypassword = md5( newdata.password );
    var username = newdata.username;
    var data = {
        username:   username,
        password:   mypassword
    };
    var auser = req.params.username;
    if(req.body.username==data.username&&req.body.password==data.password){
        req.session.user = user;
        res.send(200);
        //return res.render('issue/index', {title: '首页'});
      }else{
        req.session.error = "用户名或密码不正确";
        res.send( 404 );
        //return res.render('login', { title: '登录'});
      }
}

module.exports = {
    addUser:  addUser,
    findUser: findUser
}

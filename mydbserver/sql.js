/*
* @desc 操作数据库统一处理
*
* */
var config = require('./config'),
	Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
	Server = require('mongodb').Server;

var mongoose = require('mongoose');
mongoose.connect('mongodb://'+config.host+'/'+config.Db, function (err) {
	if (!err) {
		console.log('DB == connect to mongodb');
	} else {
		throw err;
	}
});

var Schema = mongoose.Schema;

var UserSchema = new Schema({ //创建User表模型，数据可据需求增减
	username: String,
	password: String,
	repassword: String,
	email: String,
	date: Date,
	power: Number
});

var UserModel = mongoose.model('User', UserSchema, 'User');

function initData(data, db) {
	var query = {};
	for (var key in data) {
		if (db.tree[key]) {
			query[key] = data[key];
		}
	}
	return query;
}

function addUser(data, cb) { //增加用户
	data = initData(data, UserSchema);
	(new UserModel(data)).save(function (err, doc) {
		cb(err, doc);
	})
}

function findUser(data, cb) { //查找用户
	data = initData(data, UserSchema);
	UserModel.findOne(data).exec(function (err, doc) {
		cb(err, doc);
	})
}

module.exports = {
	addUser: addUser,
	findUser: findUser
}
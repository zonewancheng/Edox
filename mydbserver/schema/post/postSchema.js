let mongoose = require('mongoose');
let {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLInt,
	GraphQLNonNull,
	GraphQLList,
	GraphQLID
} = require('graphql');
//let Hobby = require('../hobby/hobbySchema');
var settings    = require('../../models/settings');

mongoose.connect('mongodb://'+settings.host+'/'+settings.db, function( err ){
	if( !err ){
		console.log( 'DB == connect to mongodb' );
	} else {
		throw err;
	}
} );

let PostSchema = new mongoose.Schema({
	id: {type: String, required: true, unique: true, index: true, default: mongoose.Types.ObjectId},
	username: String,
	password: String,
	email: String,
	title:String,
	head: String,
	post:String,
	tags:Array,
	comment:Array,
	reprint_info:Array,
	pv:Number,
	time:{
		date:String,
		year:String,
		month:String,
		day:String,
		minute:String
	}
	//hobbies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Hobby'}],
	//friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	//type: String
});

PostSchema.set('toJSON', {getters: true});

let Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

module.exports = {
	getPostByArgs: (root, {title,username,time}) => {
		console.log(Post.db.name)
		return new Promise((resolve, reject) => {
			Post.findOne({title:title,username:username,"time.minute":time.minute}).exec((err, res) => {
				err ? reject(err) : resolve(res);
			})
		});
	},
	updatePost: (user) => {
		return new Promise((resolve, reject) => {
			Post.save((err, res) => {
				err ? reject(err) : resolve(res);
			});
		});
	},
	getListOfPost: (req) => {
		return new Promise((resolve, reject) => {
			Post.find().exec((err, res) => {
				err ? reject(err) : resolve(res);
			});
		});
	}
};


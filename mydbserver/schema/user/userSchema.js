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

let UserSchema = new mongoose.Schema({
	id: {type: String, required: true, unique: true, index: true, default: mongoose.Types.ObjectId},
	username: String,
	password: String,
	email: String,
	head: String,
	//hobbies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Hobby'}],
	//friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	//type: String
});

UserSchema.set('toJSON', {getters: true});

let User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = {
	getUserByPosition: (root, {id}) => {
		return new Promise((resolve, reject) => {
			User.find({}).exec((err, res) => {
				err ? reject(err) : resolve(res[id]);
			})
		});
	},
	updateUser: (user) => {
		return new Promise((resolve, reject) => {
			User.save((err, res) => {
				err ? reject(err) : resolve(res);
			});
		});
	},
	getListOfUsers: (req) => {
		return new Promise((resolve, reject) => {
			User.find().exec((err, res) => {
				err ? reject(err) : resolve(res);
			});
		});
	}
};


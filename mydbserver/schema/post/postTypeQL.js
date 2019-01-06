let {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLInt,
	GraphQLNonNull,
	GraphQLList,
	GraphQLID
} = require('graphql');

//let User = require('./userSchema') ;
//import HobbyType from '../Hobby/HobbyTypeQL.es6';
let Time = new GraphQLObjectType({
	name: 'Time',
	description: 'An article',
	fields: () => ({
		date:{
			type:GraphQLString
		},
		year:{
			type:GraphQLString
		},
		month:{
			type:GraphQLString
		},
		day:{
			type:GraphQLString
		},
		minute:{
			type:GraphQLString
		}
	})
})

module.exports =  new GraphQLObjectType({
	name: 'Post',
	description: 'An article',
	fields: () => ({
		_id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		username: {
			type:GraphQLString
		},
		password: {
			type:GraphQLString
		},
		email: {
			type:GraphQLString
		},
		title:{
			type:GraphQLString
		},
		head: {
			type:GraphQLString
		},
		post:{
			type:GraphQLString
		},
		tags:{
			type:new GraphQLList(GraphQLString)
		},
		comment:{
			type:new GraphQLList(GraphQLString)
		},
		reprint_info:{
			type:new GraphQLList(GraphQLString)
		},
		pv:{
			type:GraphQLInt
		},
		time:{
			type: Time
		}
		// hobbies:{
		// 	type: new GraphQLList(HobbyType)
		// }
	})
});

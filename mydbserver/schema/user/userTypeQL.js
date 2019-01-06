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

module.exports =  new GraphQLObjectType({
	name: 'User',
	description: 'A user',
	fields: () => ({
		_id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		username: {
			type: GraphQLString
		},
		password:{
			type: GraphQLString
		},
		email:{
			type: GraphQLString
		},
		head:{
			type: GraphQLString
		}
		// hobbies:{
		// 	type: new GraphQLList(HobbyType)
		// }
	})
});

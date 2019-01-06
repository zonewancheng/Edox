// schema.js
let {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLInt,
	GraphQLNonNull,
	GraphQLList,
	GraphQLID
} = require('graphql');

let mongoose = require('mongoose') ;
//let User = require('./user/userSchema') ;
//let Hobby = require('./hobby/hobbySchema');

let {
	UserQueries,
	UserMutations,
	UserType
} = require('./user/userQL');

let {
	PostQueries
} = require('./post/postQL');

// let {
// 	HobbyType,
// 	HobbyQueries,
// 	HobbyMutations,
// } = require('./hobby/hobbyQL');


let RootQuery = new GraphQLObjectType({
	name: 'Query',      //Return this type of object
	fields: () => ({
		user: UserQueries.user,
		users: UserQueries.users,
		posts:PostQueries.posts,
		post:PostQueries.post
		//hobby: HobbyQueries.hobby,
		//hobbies: HobbyQueries.hobbies
	})
});


let RootMutation = new GraphQLObjectType({
	name: "Mutation",
	fields: () => ({
		addUser: UserMutations.addUser,
		//addHobby: HobbyMutations.addHobby
	})
});


let QLSchema = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation
});

module.exports =  QLSchema;
// app.post('/', (req, res) => {
// 	//Execute the query
// 	graphql(schema, req.body)
// 		.then((result) => {
// 			res.send(result);
// 		});
// });
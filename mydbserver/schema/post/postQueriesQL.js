let {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLInt,
	GraphQLNonNull,
	GraphQLList,
	GraphQLID
} = require('graphql');

let UserType = require('./userTypeQL');
let User = require('./userSchema');

module.exports =  {
	users: {
		type: new GraphQLList(UserType),
		resolve: User.getListOfUsers
	},
	user: {
		type: UserType,
		args: {
			id: {
				type: GraphQLID
			}
		},
		resolve: User.getUserByPosition
	}
};

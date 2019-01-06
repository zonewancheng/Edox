let {
	GraphQLInputObjectType,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLInt,
	GraphQLNonNull,
	GraphQLList,
	GraphQLID
} = require('graphql');

let PostType = require('./postTypeQL');
let Post = require('./postSchema');

let searchTime = new GraphQLInputObjectType({
	name: 'searchTime',
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

module.exports =  {
	posts: {
		type: new GraphQLList(PostType),
		resolve: Post.getListOfPost
	},
	post: {
		type: PostType,
		args: {
			title: {
				type: GraphQLString
			},
			username:{
				type: GraphQLString
			},
			time:{
				type: searchTime
			}
		},
		resolve: Post.getPostByArgs
	}
};

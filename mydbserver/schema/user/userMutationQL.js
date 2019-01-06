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
	addUser:{
		type:UserType,
		args: {
			username:{
				name:'name',
				type:new GraphQLNonNull(GraphQLString)
			},
			password:{
				name:'password',
				type: new GraphQLNonNull(GraphQLString)
			},
			email:{
				name:'email',
				type: new GraphQLNonNull(GraphQLString)
			},
			head:{
				name:'head',
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		resolve: (root, {name, password, email,head}) => {
			var newUser = new User({name:name, password:password, email:email,head:head});
			
			return new Promise((resolve, reject) => {
				newUser.save((err, res) => {
					err ? reject(err): resolve(res);
				});
			});
		}
	}
};

var express = require('express');
var graphqlHTTP = require('express-graphql');
var {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLInt,
	GraphQLNonNull,
	GraphQLList,
	GraphQLID
} = require('graphql');
var graphql = require('express-graphql');
var session        = require('express-session');
var MongoStore     = require('connect-mongo')(session);
var app = express();
var http           = require( 'http' );
var server         = http.Server( app );
//var routes         = require( './routes' );
//var mongodb  = require('./models/db');
var QLSchema = require('./schema/rootSchema');


var settings    = require('./models/settings');


app.set( 'port', process.env.PORT || 3000 ); //服务启动端口

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1')
	if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
	else  next();
});




// 使用 GraphQL Schema Language 创建一个 schema
// var schema = buildSchema(`
//   type Query {
//     list: String
//   }
// `);


// A GraphQL schema
// https://github.com/graphql/graphql-js
// var schema = new GraphQLSchema({
// 	query: new GraphQLObjectType({
// 		name: 'list',
// 		fields: {
// 			username:       {
// 				type: GraphQLString
// 			},
// 			head:           {
// 				type: GraphQLString
// 			},
// 			time:           {
// 				type: GraphQLString
// 			},
// 			title:          {
// 				type: GraphQLString
// 			},
// 			tags:           {
// 				type: GraphQLList
// 			},
// 			post:           {
// 				type: GraphQLString
// 			},
// 			comment:        {
// 				type: GraphQLList
// 			},
// 			reprint_info:   {
// 				type: GraphQLString
// 			},
// 			pv:             {
// 				type: GraphQLInt
// 			}
// 		}
// 	})
// });


// app.use('/graphql', graphql(req => ({
// 	schema:QLSchema,
// 	graphql: true,
// 	//rootValue: schema
// }),(res)=>{
// 	console.log(res)
// }));

// app.post('/', (req, res) => {
// 	//Execute the query
// 	graphql(schema, req.body)
// 		.then((result) => {
// 			console.log(result);
// 			res.send(result);
// 		});
// });
app.use('/graphql', graphqlHTTP({
	schema: QLSchema,
	//rootValue: root,
	graphiql: true,
}));

app.use(session({
	secret: settings.cookieSecret,
	key: settings.db,
	cookie: {maxAge: 1000 * 60 * 60 },
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		db:   settings.db,
		url: 'mongodb://'+settings.host+':'+settings.port+'/'+settings.db,
		host: settings.host,
		port: settings.port
	})
}));


//routes.all( app );

server.listen( app.get( 'port' ), function(){                     //监听服务端口
	console.log( 'db server listening on port ' + app.get( 'port' ),app.settings.env);
});
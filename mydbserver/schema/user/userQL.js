let _UserType = require('./userTypeQL');
let _UserQueries = require('./userQueriesQL');
let _UserMutations = require('./userMutationQL');


module.exports = {
	UserType: _UserType,
	UserQueries : _UserQueries,
	UserMutations : _UserMutations
}
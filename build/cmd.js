/**
 * @desc 用于启动默认本地数据库和服务端
 * @type {commandline}
 */

let cmd = require('node-cmd');

cmd.get(
	`
	node ../server/start
	`,
	function (err, data, stderr) {
	
	}
);

//cmd.run('touch example.created.file');
/**
 * @desc 常用日期操作
 * @type {{formatDate: function(*=, *=): *}}
 */
module.exports = {
	formatDate:function(timestamp,formatStr){
		var _tdate = new Date(timestamp);
		var date = {
			"M+": _tdate.getMonth() + 1,
			"d+": _tdate.getDate(),
			"h+": _tdate.getHours(),
			"m+": _tdate.getMinutes(),
			"s+": _tdate.getSeconds(),
			"q+": Math.floor((_tdate.getMonth() + 3) / 3),
			"S+": _tdate.getMilliseconds()
		};
		if (/(y+)/i.test(format)) {
			formatStr = formatStr.replace(RegExp.$1, (_tdate.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		for (var k in date) {
			if (new RegExp("(" + k + ")").test(formatStr)) {
				formatStr = formatStr.replace(RegExp.$1, RegExp.$1.length == 1
					? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
			}
		}
		return formatStr;
		
	},
	/**
	 * @desc 格林威治时间的JSON格式字符串，转化为北京时间需要额外增加八个时区 2018/08/08 12:09:12
	 * @param time
	 * @return {string}
	 */
	getTimeStr:function(time = +new Date()) {
		var date = new Date(time + 8 * 3600 * 1000);
		return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '/');
	}
	
}
/**
 * @desc 一些通用的算法
 * @type {{getAgeByBirthday: module.exports.getAgeByBirthday, stringToBool: module.exports.stringToBool, jsonToQueryString: function(*=): string}}
 */

module.exports = {
	/**
	 * @desc  通过生日字符串获取年龄
	 * @param strBirthday
	 * @return {number}
	 */
	getAgeByBirthday: function (strBirthday) {
		try {
			let bDay = new Date(strBirthday.split("-").join("/"));
			let nDay = new Date();
			let nbDay = new Date(nDay.getFullYear(), bDay.getMonth(), bDay.getDate());
			let age = nDay.getFullYear() - bDay.getFullYear();
			if (bDay.getTime() > nDay.getTime()) { return -1 }
			return nbDay.getTime() <= nDay.getTime() ? age : --age;
		} catch (e) {
			return -1
		}
		
	},
	/**
	 * @desc //把对象中的'false','undefined','NaN'转化为boolean型的false
	 * @param obj
	 * @return {*}
	 */
	stringToBool: function (obj) {
		try {
			let _obj = {};
			for (let key in obj) {
				_obj[key] = /^(false|undefined|NaN)$/g.test(obj[key]) ? false : obj[key];
			}
			return _obj
		} catch (e) {
			return obj;
		}
	},
	/**
	 * @desc  转化json为get请求格式字符串
	 * @param json
	 * @return {string}
	 */
	jsonToQueryString: function (json) {
		return '?' +
			Object.keys(json).map(function (key) {
				return encodeURIComponent(key) + '=' +
					encodeURIComponent(json[key]);
			}).join('&');
	},
	/**
	 * @desc 转化json为路径/a/b/c/格式
	 * @param json
	 * @return {string}
	 */
	jsonToHrefString : (json) => {
		return '/' +
			Object.keys(json).map(function (key) {
				return encodeURIComponent(json[key])
			}).join('/');
	},
}
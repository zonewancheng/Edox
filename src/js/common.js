
import MD5 from "../js/md5"

/**
 * json转换为GET请求URL拼接的格式
 * @param json
 * @returns {string}
 */
let jsonToQueryString = (json) => {
	return '?' +
		Object.keys(json).map(function (key) {
			return encodeURIComponent(key) + '=' +
				encodeURIComponent(json[key]);
		}).join('&');
}

/**
 * 生成签名并在签名中添加salt
 * @param paraStr
 * @returns {*}
 */
let getSign = (paraStr) => {
	let salt = "oooooo100234~^jksdsvfbdfb^''sdfsk fsdf";
	let str = paraStr + salt;
	return MD5(str)
}

/**
 * 导出公共方法
 */
export default {
	jsonToQueryString : jsonToQueryString,
	getSign : getSign
}
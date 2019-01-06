
//import MD5 from "md5"


/**
 * 导出公共方法
 */
let commonJs = {
	
	/**
	 * json转换为GET请求URL拼接的格式
	 * @param json
	 * @returns {string}
	 */
	jsonToQueryString :(json) => {
		return '?' +
			Object.keys(json).map(function (key) {
				return encodeURIComponent(key) + '=' +
					encodeURIComponent(json[key]);
			}).join('&');
	},
	jsonToHrefString : (json) => {
		return '/' +
			Object.keys(json).map(function (key) {
				return encodeURIComponent(json[key])
			}).join('/');
	},
	getQueryString:(name) =>{
		let reg = `(^|&)${name}=([^&]*)(&|$)`
		let r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	},
	getUrlParams:function () {
		let pram = window.location.search.substr(1);
		pram = pram.split("&");
		let params = {};
		for(let index in pram){
			let arr = pram[index].split("=");
			params[decodeURIComponent(arr[0])]=decodeURIComponent(arr[1]);
		}
		return params
	}
	/**
	 * 生成签名并在签名中添加salt
	 * @param paraStr
	 * @returns {*}
	//  */
	// getSign : (paraStr) => {
	// 	let salt = "oooooo100234~^jksdsvfbdfb^''sdfsk fsdf";
	// 	let str = paraStr + salt;
	// 	return MD5(str)
	// }
};
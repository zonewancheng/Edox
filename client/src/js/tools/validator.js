/**
 * @desc 一些常用信息的核验
 * @type {{isMobile: function(*=): boolean, isUserName: function(*=): boolean, isEmail: function(*=): boolean, is12306Pswd: module.exports.is12306Pswd, isPassport: function(*=): boolean, isHVPS: function(*=): boolean, isMTP: function(*=): boolean, isIdCard: module.exports.isIdCard}}
 */
module.exports = {
	/**
	 * @desc 核验手机号码格式
	 * @param txt
	 * @return {boolean}
	 */
	isMobile: function (txt) {
		return /^1[3-9]\d{9}$/.test(txt);
	},
	
	/**
	 * @desc  名称是否符合格式
	 * @param txt
	 * @return {boolean}
	 */
	isUserName: function (txt) {
		return /^[a-z·\u4e00-\u9fa5]+$/i.test(txt);
	},
	
	/**
	 * @desc 电子邮箱格式是否正确
	 * @param txt
	 * @return {boolean}
	 */
	isEmail: function (txt) {
		return /^\w+([-+.\']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(txt);
	},
	
	/**
	 * @desc 是否符合12306密码规范
	 * @param txt
	 * @return {boolean}
	 */
	is12306Pswd: function (txt) {
		if (/^[a-z0-9_]+$/i.test(txt)) {
			if (/^[a-z]+$/i.test(txt)) ;
			else if (/^[0-9]+$/.test(txt)) ;
			else if (/^[_]+$/.test(txt)) ;
			return true;
		}
		return false;
	},
	
	/**
	 * @desc 护照格式是否符合
	 * @param txt
	 * @return {boolean}
	 */
	isPassport: function (txt) {
		return /^[a-zA-Z0-9]{5,17}$/.test(txt);
	},
	
	/**
	 * @desc 港澳通行证（回乡证）格式
	 * @param txt
	 * @return {boolean}
	 */
	isHVPS: function (txt) {
		return /^(m|M|h|H)(\d{8}|\d{10})$/.test(txt);
	},
	
	/**
	 * @desc 核验台胞证格式
	 * @param txt
	 * @return {boolean}
	 */
	isMTP: function (txt) {
		return /^(\d{8}|\d{10})$/.test(txt);
	},
	
	/**
	 * @desc 校验身份证格式
	 * @param txt
	 * @param allow15Bit
	 * @return {boolean}
	 */
	isIdCard: function (txt, allow15Bit) {
		//return /(^[0-9]{17}([0-9]|X|x)$)|(^[0-9]{15}$)/.test(txt);
		
		var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];    // 加权因子
		var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];            // 身份证验证位值.10代表X
		var idCard = txt;
		idCard = trim(idCard.replace(/ /g, ""));               //去掉字符串头尾空格
		if (allow15Bit && idCard.length == 15) {
			return isValidityBrithBy15IdCard(idCard);       //进行15位身份证的验证
		} else if (idCard.length == 18) {
			var a_idCard = idCard.split("");                // 得到身份证数组
			if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) {   //进行18位身份证的基本验证和第18位的验证
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
		
		/**
		 * @desc  判断身份证号码为18位时最后的验证位是否正确
		 * @param a_idCard 身份证号码数组
		 * @return
		 */
		function isTrueValidateCodeBy18IdCard(a_idCard) {
			var sum = 0;                             // 声明加权求和变量
			if (a_idCard[17].toLowerCase() == 'x') {
				a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作
			}
			for (var i = 0; i < 17; i++) {
				sum += Wi[i] * a_idCard[i];            // 加权求和
			}
			var valCodePosition = sum % 11;                // 得到验证码所位置
			if (a_idCard[17] == ValideCode[valCodePosition]) {
				return true;
			} else {
				return false;
			}
		}
		
		/**
		 * @desc  验证18位数身份证号码中的生日是否是有效生日
		 * @param idCard18 18位书身份证字符串
		 * @return
		 */
		function isValidityBrithBy18IdCard(idCard18) {
			var year = idCard18.substring(6, 10);
			var month = idCard18.substring(10, 12);
			var day = idCard18.substring(12, 14);
			var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
			// 这里用getFullYear()获取年份，避免千年虫问题
			if (temp_date.getFullYear() != parseFloat(year)
				|| temp_date.getMonth() != parseFloat(month) - 1
				|| temp_date.getDate() != parseFloat(day)) {
				return false;
			} else {
				return true;
			}
		}
		
		/**
		 * @desc  验证15位数身份证号码中的生日是否是有效生日
		 * @param idCard15 15位书身份证字符串
		 * @return
		 */
		function isValidityBrithBy15IdCard(idCard15) {
			var year = idCard15.substring(6, 8);
			var month = idCard15.substring(8, 10);
			var day = idCard15.substring(10, 12);
			var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
			// 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
			if (temp_date.getYear() != parseFloat(year)
				|| temp_date.getMonth() != parseFloat(month) - 1
				|| temp_date.getDate() != parseFloat(day)) {
				return false;
			} else {
				return true;
			}
		}
		
		/**
		 * @desc 去掉字符串头尾空格
		 * @param str
		 * @return {*}
		 */
		function trim(str) {
			return str.replace(/(^\s*)|(\s*$)/g, "");
		}
		
		
	}
};


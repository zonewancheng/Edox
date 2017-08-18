/**
 * Author: fishCat
 * Date:   2017/7/25
 * Email:  oosapce@gmail.com
 */

'use strict';
//函数节流

var throttle = function throttle(fun, delay) {
    var last = null;
    return function () {
        var now = +new Date();
        if (now - last > delay) {
            fun();
            last = now;
        }
    };
};
//实例
var throttleExample = throttle(function () {
    return console.log(1);
}, 1000);
//调用
throttleExample();
throttleExample();
throttleExample();
//函数防抖
var debouce = function debouce(fun, delay) {
    var timer = null;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            fun();
        }, delay);
    };
};
//实例
var debouceExample = debouce(function () {
    return console.log(111);
}, 1000);
//调用
debouceExample();
debouceExample();
debouceExample();
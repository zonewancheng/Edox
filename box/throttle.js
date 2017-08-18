/**
 * Author: fishCat
 * Date:   2017/7/25
 * Email:  oosapce@gmail.com
 */
//函数节流
const throttle = (fun, delay) => {
    let last = null;
    return () => {
        const now = + new Date();
        if (now - last > delay) {
            fun();
            last = now;
        }
    }
}
//实例
const throttleExample  = throttle(() => console.log(1), 1000);
//调用
throttleExample();
throttleExample();
throttleExample();
//函数防抖
const debouce = (fun, delay) => {
    let timer = null;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
                fun();
    }, delay);
    }
}
//实例
const debouceExample = debouce(() => console.log(111), 1000);
//调用
debouceExample();
debouceExample();
debouceExample();

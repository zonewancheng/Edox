/**
 * Author: fishCat
 * Date:   2017/8/17
 * Email:  oosapce@gmail.com
 */
var $ = Edox = function () {

}
epx = Edox.prototype;
epx.app = function () {
    
}
epx.dom = function () {

}
epx.bom = function () {

}
epx.ajax = function () {

}
epx.axios = function () {

}
epx.fetch = function () {

}
epx.array = function () {

}
epx.map = function () {

}
epx.date = function () {

}
epx.dictionary = function () {
    this.data = new Array();

    this.put = function (key, value) {
        this.data[key] = value;
    };

    this.get = function (key) {
        return this.data[key];
    };

    this.remove = function (key) {
        this.data[key] = null;
    };

    this.isEmpty = function () {
        return this.data.length == 0;
    };

    this.size = function () {
        return this.data.length;
    };
}
epx.sessionStorage = function () {
    this.setItem = function () {

    }
    this.getItem = function () {

    }
}
epx.localStorage = function () {
    this.setItem = function () {

    }
    this.getItem = function () {

    }
}
epx.cookie = function () {
//获取cookie对象，以对象表示
    this.getCookiesObj = function () {
        var cookies = {};
        if (document.cookie) {
            var objs = document.cookie.split('; ');
            for (var i in objs) {
                var index = objs[i].indexOf('='),
                    name = objs[i].substr(0, index),
                    value = objs[i].substr(index + 1, objs[i].length);
                cookies[name] = value;
            }
        }
        return cookies;
    }
    //设置cookie
    this.set = function (name, value, opts) {
        //opts maxAge, path, domain, secure
        if (name && value) {
            var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
            //可选参数
            if (opts) {
                if (opts.maxAge) {
                    cookie += '; max-age=' + opts.maxAge;
                }
                if (opts.path) {
                    cookie += '; path=' + opts.path;
                }
                if (opts.domain) {
                    cookie += '; domain=' + opts.domain;
                }
                if (opts.secure) {
                    cookie += '; secure';
                }
            }
            document.cookie = cookie;
            return cookie;
        } else {
            return '';
        }
    }
    //获取cookie
    this.get = function (name) {
        return decodeURIComponent(this.getCookiesObj()[name]) || null;
    }

    //清除某个cookie
    this.remove = function (name) {
        if (this.getCookiesObj()[name]) {
            document.cookie = name + '=; max-age=0';
        }
    }

    //清除所有cookie
    this.clear = function () {
        var cookies = this.getCookiesObj();
        for (var key in cookies) {
            document.cookie = key + '=; max-age=0';
        }
    }
    //获取所有cookies
    this.getCookies = function (name) {
        return this.getCookiesObj();
    }
    //解决冲突
    /*this.noConflict=function(name){
        if(name && typeof name === 'string'){
            if(name && window['cookie']){
                window[name] = window['cookie'];
                delete window['cookie'];
                return window[name];
            }
        }else{
            return window['cookie'];
            delete window['cookie'];
        }
    }*/
}
epx.db = function () {

}
epx.cache = function () {

}
epx.manifest = function () {

}
epx.method = function () {

}
epx.device = function () {

}
epx.valid = function () {

}
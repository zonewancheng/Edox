define(function(  ){

    var isArray = function( value ){
        return Object.prototype.toString.call( value ) == '[object ]'
    }

    /*定义常用规则，通过判断值是否符合规则返回true / false */
    var Regular = {

        //非空
        noBlank: function( value ){
            return !!value;
        },
        //最小
        min: function( value, rule ){
            return value.length >= rule;
        },
        //最大
        max: function( value, rule ){
            return value.length <= rule;
        },
        //中文、英文
        typeZE: function( value ){
            return /^[\u4E00-\u9FA5\uf900-\ufa2d\uFE30-\uFFA0a-zA-Z]+$/.test( value );
        },
        //英文、数字
        typeEN: function( value ){
            return /^[0-9|a-z|A-Z]+$/.test( value );
        },
        //数字
        typeNum: function( value ){
            return !isNaN( value );
        },
        //电话
        typePhone: function( value ){
            return /^1[0-9]{10}$/.test( value );
        },
        //email
        typeEmail: function( value ){
            return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(value)
        }

    }
    //循环对规则进行验证，主要分类两种。一种是self，一种是已定义的常用规则。
    function check( rules, cb ){

        var rule,
            prompt,
            codex,
            value = this.value;
        for ( rule in rules ){

            prompt = rules[ rule ];
            isArray( prompt ) && ( codex = prompt[0] ) && ( prompt = prompt[1] );
            //这里是针对 即带值，又带提示的规则 [ 3, '用户名不能少于3位']
            //否则只带提示的规则，如非空，电话号码等值可定的规则
            if( rule == 'self' ){    //验证自定义的定义
                if( rules[ rule ].call( this, cb ) !== true ){
                    return false;
                };
            } else if( !Regular[ rule ]( value, codex ) ){    //验证上面定义过的规则
                cb( prompt )
                return false;
            }
            cb( '' );
        }
        return true;

    }
    //开始的验证函数，对某元素el添加指定事件events的验证规则rules，验证结果在cb中执行
    function validate( el, events, rules, cb ){

        if( rules ){

            cb = rules[1];
            rules = rules[0];
            $.each( events, function( k, event ){
                el.on( event, function(){
                    check.call( this, rules, cb );
                });

            });

        } else {
            //这里是对不用传触发条件，直接进行验证的规则。主要是针对form.submit时需一次验证所有输入框时
            cb = events[1];
            rules = events[0];
            return check.call( el.get( 0 ), rules, cb );

        }

    }

    return validate

})
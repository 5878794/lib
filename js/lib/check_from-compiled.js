"use strict";

//正则验证dom中的input，会自动去掉输入的字符串2头的空格
//规则：   设置在input上   data-rule="min:1,max:10,must"

//max:10    最多10个字符
//min:1     最少1个字符
//must      必填项目
//str       字符串   字符串，数字和下划线
//number    正整数
//price     价格带2位小数
//qq        qq号  5位以上
//email     邮箱
//phone     手机号
//idCard    身份证
//chinese   中文

//验证时执行
//$("#form").checkFrom(function(errorDom,data){})

//errorDom  @param:array   验证未通过的input   数组中包含jq对象
//data      @param:json    元素id为key，值为value的对象

(function () {
    var rules = {
        //不大于多少个字符
        max: function max(str, number) {
            var regStr = "^.{0," + number + "}$",
                reg = new RegExp(regStr);

            return reg.test(str);
        },
        //不少于多少个字符
        min: function min(str, number) {
            var regStr = "^.{" + number + ",}$",
                reg = new RegExp(regStr);

            return reg.test(str);
        },
        //判断非空
        must: function must(str) {
            return str.length != 0;
        },
        //字符串，数字和下划线
        str: function str(_str) {
            if (_str.length == 0) {
                return true;
            }

            var reg = /^[a-zA-Z][a-zA-Z0-9_]*$/;
            return reg.test(_str);
        },
        //正整数
        number: function number(str) {
            if (str.length == 0) {
                return true;
            }

            var reg = /^\d*$/;
            return reg.test(str);
        },
        //价格  2为小数
        price: function price(str) {
            if (str.length == 0) {
                return true;
            }

            var reg = /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/;
            return reg.test(str);
        },
        //qq 号
        qq: function qq(str) {
            if (str.length == 0) {
                return true;
            }

            var reg = /^[1-9]\d{4,}$/;
            return reg.test(str);
        },
        //邮箱email
        email: function email(str) {
            if (str.length == 0) {
                return true;
            }

            var reg = /^([0-9a-z][0-9a-z_]*[0-9a-z]|[0-9a-z])@[a-z0-9.-]+\.[a-z]{2,4}$/i;
            return reg.test(str);
        },
        //手机号码
        phone: function phone(str) {
            if (str.length == 0) {
                return true;
            }

            var reg = /^1\d{10}$/;
            return reg.test(str);
        },
        //身份证
        idCard: function idCard(str) {
            if (str.length == 0) {
                return true;
            }

            var reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
            return reg.test(str);
        },
        //中文
        chinese: function chinese(str) {
            if (str.length == 0) {
                return true;
            }

            var reg = /^[\u4E00-\u9FA5]+$/;
            return reg.test(str);
        }
    };

    $.fn.checkFrom = function (callback) {
        var dom = $(this),
            checkInput = dom.find("[data-rule]"),
            errorDom = [],
            data = {};

        checkInput.each(function () {
            var that_rule = $(this).data("rule"),
                this_val = $.trim($(this).val()),
                this_id = $(this).attr("id");

            that_rule = that_rule.split(",");

            data[this_id] = this_val;
            for (var i = 0, l = that_rule.length; i < l; i++) {
                var this_rule = that_rule[i];
                if (this_rule.indexOf('max:') > -1 || this_rule.indexOf('min:') > -1) {
                    this_rule = this_rule.split(":");
                    var _this_rule = this_rule[0],
                        _n = parseInt(this_rule[1]);

                    if (!rules[_this_rule]) {
                        console.log(_this_rule + "  无此正则");
                    } else {
                        if (!rules[_this_rule](this_val, _n)) {
                            errorDom.push($(this));
                        }
                    }
                } else {
                    if (!rules[this_rule]) {
                        console.log(this_rule + "  无此正则");
                    } else {
                        if (!rules[this_rule](this_val)) {
                            errorDom.push($(this));
                        }
                    }
                }
            }
        });

        callback(errorDom, data);
    };
})();

//# sourceMappingURL=check_from-compiled.js.map
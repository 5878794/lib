

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
//nickname  中文、英文、数字、下划线


//验证时执行
//$("#form").checkFrom(function(errorDom,data){})

//errorDom  @param:array   验证未通过的input   数组中包含jq对象
//data      @param:json    元素id为key，值为value的对象



(function(){
    let rules = {
        //不大于多少个字符
        max:function(str,number){
            let regStr = "^.{0,"+number+"}$",
                reg = new RegExp(regStr);

            return reg.test(str);
        },
        //不少于多少个字符
        min:function(str,number){
            let regStr = "^.{"+number+",}$",
                reg = new RegExp(regStr);

            return reg.test(str);
        },
        //判断非空
        must:function(str){
            return(str.length != 0);
        },
        //字符串，数字和下划线
        str:function(str){
            if(str.length == 0){return true;}

            let reg = /^[a-zA-Z][a-zA-Z0-9_]*$/;
            return reg.test(str);
        },
        //正整数
        number:function(str){
            if(str.length == 0){return true;}

            let reg = /^\d*$/;
            return reg.test(str);
        },
        //价格  2为小数
        price:function(str){
            if(str.length == 0){return true;}

            let reg = /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/;
            return reg.test(str);
        },
        //qq 号
        qq:function(str){
            if(str.length == 0){return true;}

            let reg = /^[1-9]\d{4,}$/;
            return reg.test(str);
        },
        //邮箱email
        email:function(str){
            if(str.length == 0){return true;}

            let reg = /^([0-9a-z][0-9a-z_]*[0-9a-z]|[0-9a-z])@[a-z0-9.-]+\.[a-z]{2,4}$/i;
            return reg.test(str);
        },
        //手机号码
        phone:function(str){
            if(str.length == 0){return true;}

            let reg = /^1\d{10}$/;
            return reg.test(str);
        },
        //身份证
        idCard: function(cid) {
            if (cid.length == 0) {
                return true;
            }


            var arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];//加权因子
            var arrValid = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];//校验码
            if(/^\d{17}\d|x$/i.test(cid)){
                var sum = 0, idx;
                for(var i = 0; i < cid.length - 1; i++){
                    // 对前17位数字与权值乘积求和
                    sum += parseInt(cid.substr(i, 1), 10) * arrExp[i];
                }
                // 计算模（固定算法）
                idx = sum % 11;
                // 检验第18为是否与校验码相等
                return arrValid[idx] == cid.substr(17, 1).toUpperCase();
            }else{
                return false;
            }

            //var reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
            //return reg.test(str);
        },
        //中文
        chinese:function(str){
            if(str.length == 0){return true;}

            let reg = /^[\u4E00-\u9FA5]+$/;
            return reg.test(str);
        },
        //昵称
        nickname: function(str) {
            if (str.length == 0) {
                return true;
            }

            var reg = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/;
            return reg.test(str);
        }
    };




    $.fn.checkFrom = function(callback){
        let dom = $(this),
            checkInput = dom.find("[data-rule]"),
            errorDom = [],
            data = {};

        checkInput.each(function(){
            let that_rule = $(this).data("rule"),
                this_val = $.trim($(this).val()),
                this_id = $(this).attr("id");

            that_rule = that_rule.split(",");

            data[this_id] = this_val;
            for(var i=0,l=that_rule.length;i<l;i++){
                let this_rule = that_rule[i];
                if(this_rule.indexOf('max:')>-1 || this_rule.indexOf('min:')>-1){
                    this_rule = this_rule.split(":");
                    let _this_rule = this_rule[0],
                        _n = parseInt(this_rule[1]);

                    if(!rules[_this_rule]){
                        console.log(_this_rule+"  无此正则");
                    }else{
                        if(!rules[_this_rule](this_val,_n)){
                            errorDom.push($(this));
                        }
                    }
                }else{
                    if(!rules[this_rule]){
                        console.log(this_rule+"  无此正则");
                    }else{
                        if(!rules[this_rule](this_val)){
                            errorDom.push($(this));
                        }
                    }
                }
            }
        });


        callback(errorDom,data);
    };
})();




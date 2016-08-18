"use strict";

//异步执行队列方式

//函数定义
//函数结束的时候需要执行  DEVICE.asyncRunner.next();  触发队列中的下一个函数
//保存数据    DEVICE.asyncRunner.saveData("a",{a:1});
//获取数据    var data = DEVICE.asyncRunner.getData("a");

//var a = {
//    a:function(){
//        setTimeout(function(){
//            console.log("a");
//            DEVICE.asyncRunner.saveData("a",{a:1});
//            DEVICE.asyncRunner.next();
//        },100);
//    },
//    b:function(){
//        setTimeout(function(){
//            var data = DEVICE.asyncRunner.getData("a");
//            console.log(data);
//            DEVICE.asyncRunner.next();
//        },100);
//    },
//    c:function(){setTimeout(function(){console.log("c");DEVICE.asyncRunner.next();},100);},
//    d:function(){setTimeout(function(){console.log("d");DEVICE.asyncRunner.next();},0);},
//    e:function(){setTimeout(function(){console.log("e");DEVICE.asyncRunner.next();},100);},
//    f:function(){setTimeout(function(){console.log("f");DEVICE.asyncRunner.next();},0);},
//    g:function(){setTimeout(function(){console.log("g");DEVICE.asyncRunner.next();},100);}
//};
//
//
//执行方式
//$(document).ready(function(){
//    DEVICE.asyncRunner.run([
//        {
//            fn:a.a,           //需要执行的函数名
//            async:false        //是否异步执行。 true：不会等待上一个同步函数的结束就开始执行。
//        },
//        {fn:a.b,async:true},
//        {fn:a.c,async:false},
//        {fn:a.d,async:false},
//        {fn:a.e,async:false},
//        {fn:a.f,async:false}
//    ])
//});

(function () {
    //let event = document.createEvent('Event');
    //event.initEvent("asyncRunner",true,true);
    //
    //document.addEventListener("asyncRunner",function(){
    //    DEVICE.asyncRunner.go();
    //},false);

    var cache = [],
        start = 0,
        end = 0,
        data = {};

    DEVICE.asyncRunner = {
        next: function next() {
            end++;

            var _this = this;
            setTimeout(function () {
                _this.go();
                //document.dispatchEvent(event);
            }, 0);
        },
        go: function go() {

            if (start != end) {
                return;
            }

            if (cache.length == 0) {
                return;
            }

            var runFn = function runFn() {
                var obj = cache.shift(),
                    fn = obj.fn;

                start++;
                fn();
            };

            runFn();

            //获取下一个函数的状态是否是异步
            while (cache.length != 0 && cache[0].async) {
                runFn();
            }
        },
        run: function run(obj) {
            for (var i = 0, l = obj.length; i < l; i++) {
                cache.push(obj[i]);
            }
            this.go();
        },
        saveData: function saveData(key, val) {
            data[key] = val;
        },
        getData: function getData(key) {
            return data[key];
        }

    };
})();

//# sourceMappingURL=asyncRunner-compiled.js.map
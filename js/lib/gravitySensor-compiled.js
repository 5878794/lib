"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//重力感应

//var obj = $("#test");
//new DEVICE.gravitySensor({
//    moveFn:function(x,y){
//        //x:y轴旋转角度 -90 - 90
//        //y:x轴旋转角度 -90 - 90
//        //旋转角度可转换成百分比在转换成实际的移动像素x,y
//        //手机横向时 x=y  y=x;
//        obj.css3({transform:"translate3d("+x+"px,"+y+"px,0)"});
//    }
//});

DEVICE.gravitySensor = function () {
    function sensor(opt) {
        _classCallCheck(this, sensor);

        this.moveFn = opt.moveFn || function () {};

        this._init();
    }

    _createClass(sensor, [{
        key: "_init",
        value: function _init() {
            this._addEvent();
        }
    }, {
        key: "_addEvent",
        value: function _addEvent() {
            var _this = this;

            window.addEventListener("deviceorientation", function (e) {
                //设备水平放置到桌面时  beta和gamma的值都为0
                //x:e.beta  -180 - 180   绕x轴旋转角度
                //y:e.gamma  -90 - 90    绕y轴旋转角度

                //e.alpha  0-360  设备指示的方向，根据指南针的设定情况而定
                _this.handlerEvent(e);
            }, false);
        }
    }, {
        key: "handlerEvent",
        value: function handlerEvent(e) {
            var beta = e.beta,
                gamma = e.gamma;

            //强制只返回-90 - 90度的值
            //beta = DEVICE.getBetweenNumber(beta,-90,90);
            //gamma = DEVICE.getBetweenNumber(gamma,-90,90);

            this._xMove(gamma, beta);
        }
    }, {
        key: "_xMove",
        value: function _xMove(x, y) {
            y = DEVICE.getBetweenNumber(y, -90, 90);
            //参数为度数
            this.moveFn(x, y);
        }
    }]);

    return sensor;
}();

//$(document).ready(function(){
//    var obj = $("#test");
//    new DEVICE.gravitySensor({
//        moveFn:function(x,y){
//            console.log(y)
//            obj.css3({transform:"translate3d("+x+"px,"+y+"px,0)"});
////                console.log(x+"   "+y)
//        }
//    });
//});

//# sourceMappingURL=gravitySensor-compiled.js.map
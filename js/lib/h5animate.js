/**
 * Created by beens on 15/11/7.
 */







//h5动画函数，简单封装
//b = new DEVICE.h5animate({
//    time:5000,                //@param:number    动画持续时间（ms）
//    stepFn:function(pre){     //@param:fn       动画每步需要执行的函数
//        var left = 30+ 40*pre;        //pre:  number(0-1) 动画当前执行的时间比例
//                  //30:初始a元素的left百分比
//                  //40:整个动画需要移动的距离
//                  //整体是计算当前的left值
//        a.css({left:left+"%"});
//    },
//    endFn:function(){         //@param:fn    动画执行完回调
//        b.replay();               //重复执行动画形成循环
//    }
//});
//b.play();         //开始动画
//b.stop();         //停止动画
//b.replay();       //重新开始执行动画



DEVICE.h5animate = (function(){
    var nextFrame = DEVICE.nextFrame,
        cancelFrame = DEVICE.cancelFrame;

    var animate = function(opt){
        this.runTime = opt.time;     //动画持续时间
        this.stepFn = opt.stepFn || function(){};   //每步执行的函数，参数：自动返回当前动画执行的百分比
        this.endFn = opt.endFn || function(){};     //动画执行完毕回调


        this.startTime = 0;         //动画开始时间
        this.endTime = 0;           //动画结束时间
        this.nowTime = 0;           //当前动画执行到的时间
        this._useedTime = 0;        //停止后在开始动画时的之前动画时间总和
        this._fn = null;            //nextFrame 临时赋值变量
        this.isRuning = false;      //动画是否在运行
        this.autoStop = false;      //动画是否由最小化窗口暂停

        this.addEvent();
    };

    animate.prototype = {
        //浏览器最小化时停止动画，恢复时执行
        addEvent:function(){
            var _this =this;
            document.addEventListener('visibilitychange', function() {
                if(document.hidden){
                    //最小化
                    if(_this.isRuning){
                        _this.autoStop = true;
                        _this.stop();
                    }
                }else{
                    //恢复窗口
                    if(_this.autoStop){
                        _this.autoStop = false;
                        _this.play();
                    }
                }
            },false)
        },
        //执行
        _go:function(){
            var _this = this;

            var __step__ = function(){
                var now_time = new Date().getTime() + _this._useedTime,
                    use_time = now_time  - _this.startTime,
                    pre = use_time/_this.runTime;

                _this.nowTime = now_time;

                if(now_time>=_this.endTime){
                    _this.stepFn(1);
                    _this.stop();
                    _this.endFn();
                    return;
                }

                _this.stepFn(pre);
                _this._fn = nextFrame(__step__);
            };

            __step__();
        },
        //开始动画
        play:function(){
            this.startTime = new Date().getTime();
            this.endTime = this.startTime + this.runTime;
            this.isRuning = true;
            this._go();
        },
        //暂停动画
        stop:function(){
            cancelFrame(this._fn);
            this._fn = null;
            this.isRuning = false;
            //重置运行时间
            this._useedTime = this.nowTime - this.startTime;
        },
        //从头开始动画
        replay:function(){
            this._useedTime = 0;
            this.play();
        }

    };

    return animate;
})();
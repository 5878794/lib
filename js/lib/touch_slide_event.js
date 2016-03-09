/**
 * Created by beens on 15/12/23.
 */


//touch滑动事件封装（简单版）
//var a = new DEVICE.touchSlideEvent({
//    dom:$("#div"),          //@param:jqobj   要监听的dom
//    startFn:function(){},   //@param:fn      手指按下时执行
//    moveFn:function(opt){   //@param:fn      手指滑动时执行
//        //opt.start.x   初始点 x，y
//        //opt.start.y
//        //opt.end.x     当前点 x ，y
//        //opt.end.y
//        //opt.move.x    当前点到初始点的距离  x ，y
//        //opt.move.y
//    },
//    endFn:function(opt,isSlide){    //@param：fn  手指释放的时候执行
//        //opt同上
//        //isSlide   布尔，是否触发快速滑动
//    },
//    slideLeftFn:function(){},     //@param:fn   快速左滑促发
//    slideRightFn:function(){},    //@param:fn   快速右滑促发
//    slideUpFn:function(){},       //@param:fn   快速上滑促发
//    slideDownFn:function(){},     //@param:fn   快速下滑促发
//    slideMaxTime:500,       //@param：number  触发快速滑动的最大时间 默认：500 ms
//    useDirection:"x"        //@param:str    "x","y","xy"
//                            //使用哪个方向的滑动   默认：x
//});

//销毁
//a.destroy();



DEVICE.touchSlideEvent = (function(){
    var touch = function(opt){
        opt = opt || {};
        this.dom = opt.dom || $("body");

        this.startFn = opt.startFn || function(){};
        this.moveFn = opt.moveFn || function(){};
        this.endFn = opt.endFn || function(){};
        this.slideLeftFn = opt.slideLeftFn || function(){};
        this.slideRightFn = opt.slideRightFn || function(){};
        this.slideUpFn = opt.slideUpFn || function(){};
        this.slideDownFn = opt.slideDownFn || function(){};

        this.slideMaxTime = opt.slideMaxTime || 500;
        this.useDirection = opt.useDirection || "x";   // x,y,xy


        this.touchStartFn = null;
        this.touchMoveFn = null;
        this.touchEndFn = null;
        this.points = [];
        this.isTouched = false;
        this.touchTime = 0;

        this.init();
    };
    touch.prototype = {
        init:function(){
            this.addEvent();
        },
        addEvent:function(){
            var obj = this.dom.get(0),
                _this = this;

            obj.addEventListener(DEVICE.START_EV,this.touchStartFn = function(e){
                _this.start(e);
            },false);
            document.addEventListener(DEVICE.MOVE_EV,this.touchMoveFn = function(e){
                _this.move(e);
            },false);
            document.addEventListener(DEVICE.END_EV,this.touchEndFn = function(e){
                _this.end(e)
            },false);
        },
        start:function(e){
            this.isTouched = true;
            this.clearPoint();
            this.savePoint(e);
            this.touchTime = new Date().getTime();
            this.startFn();
        },
        move:function(e){
            if(!this.isTouched){return;}
            //e.preventDefault();
            //e.stopPropagation();

            this.savePoint(e);

            if(this.points.length<2){return;}

            var points = this.getStartAndEndPoint(),
                move_x = Math.abs(points.move.x),
                move_y = Math.abs(points.move.y);

            if(this.useDirection == "x"){
                if(move_x > move_y){
                    e.preventDefault();
                    this.moveFn(points);
                }
            }else if(this.useDirection == "y"){
                if(move_y > move_x){
                    e.preventDefault();
                    this.moveFn(points);
                }
            }else{
                e.preventDefault();
                this.moveFn(points);
            }
        },
        end:function(){
            if(!this.isTouched){return;}
            this.isTouched = false;
            var time = new Date().getTime(),
                points = this.getStartAndEndPoint(),
                notSlide = (time - this.touchTime > this.slideMaxTime);
            this.endFn(points,!notSlide);

            //超时不触发滑动
            if(notSlide){return;}

            var m_x = points.move.x,
                m_y = points.move.y,
                is_x_long = (Math.abs(m_x) >= Math.abs(m_y));

            //右滑
            if(m_x>0 && is_x_long){
                if(this.useDirection != "y"){
                    this.slideRightFn();
                }
            }
            //左滑
            if(m_x<0 && is_x_long){
                if(this.useDirection != "y") {
                    this.slideLeftFn();
                }
            }
            //上滑
            if(m_y<0 && !is_x_long){
                if(this.useDirection != "x") {
                    this.slideUpFn();
                }
            }
            //下滑
            if(m_y>0 && !is_x_long){
                if(this.useDirection != "x") {
                    this.slideDownFn();
                }
            }


        },
        savePoint:function(e){
            var touch = (e.touches)? e.touches[0] : e;
            this.points.push({x:touch.clientX,y:touch.clientY});
        },
        clearPoint:function(){
            this.points = [];
        },
        getStartAndEndPoint:function(){
            var sPoint = this.points[0],
                len = this.points.length,
                ePoint = this.points[len-1],
                moveX = ePoint.x - sPoint.x,
                moveY = ePoint.y - sPoint.y;

            return {
                start:sPoint,
                end:ePoint,
                move:{
                    x:moveX,
                    y:moveY
                }
            }
        },
        destroy:function(){
            this.dom.get(0).removeEventListener(DEVICE.START_EV,this.touchStartFn,false);
            document.removeEventListener(DEVICE.MOVE_EV,this.touchMoveFn,false);
            document.removeEventListener(DEVICE.END_EV,this.touchEndFn,false);
        }
    };
    return touch;
})();



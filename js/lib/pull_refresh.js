/**
 * Created by beens on 15/12/18.
 */


//下拉刷新插件，自动屏幕浏览器顶部的自带事件（比如ios顶部的弹性回滚）
//a = new DEVICE.pullRefresh({
//    refreshDom:div,          //@param:jqobj  下拉刷新时显示的div
//                                              该div会自动定位到主体dom的上方
//    dom:$("#aaa"),           //@param:jqibj   跟随浏览器滑动的主体dom
//    refreshFn:function(){    //@param:fn      触发刷新时执行
//        div.text("正在加载")
//
//        setTimeout(function(){
//            a.hideLoading();    //数据加载完成后调用该方法隐藏刷新时显示的dom
//        },3000)
//
//    },
//                                      //可释放刷新的点在refreshDom的2/3高度
//    nowRefreshCanRunFn:function(){   //拉动到可以释放刷新时执行的函数
//        div.text("释放刷新");
//    },
//    nowRefreshNotCanRunFn:function(){  //拉动到不可以释放刷新时执行的函数
//        div.text("下拉刷新");
//    }
//});


//a.hideLoading();    //数据加载完成后调用该方法隐藏刷新时显示的dom
//a.destroy();        //销毁功能






(function(){
    var pullRefresh = function(opt){
        //刷新要显示的div
        this.refreshDom = opt.refreshDom;      //下拉刷新要显示的div  jqobj
        this.refreshFn = opt.refreshFn || function(){}; //刷新触发执行
        this.nowRefreshCanRunFn = opt.nowRefreshCanRunFn || function(){};
        this.nowRefreshNotCanRunFn = opt.nowRefreshNotCanRunFn || function(){};
        //要移动的主体
        this.body = opt.dom || $("body");   //滑动的主体 jqobj


        //判断是否已点击
        this.isTouch = false;
        //判断是否已经被下拉
        this.state = false;
        //判断是否正在从服务器请求数据
        this.isRefreshing = false;
        //已修正的距离
        this.y = 0;
        //顶部刷新dom的高度
        this.refreshDomHeight = parseInt(this.refreshDom.height());
        //触摸点的记录
        this.points = [];
        //回弹动画函数
        this.backAnimateFn = null;

        //
        this.touchEndFn = null;
        this.touchMoveFn = null;
        this.touchStartFn = null;


        this.init();
    };
    pullRefresh.prototype = {
        init:function(){
            this.setRefreshDiv();
            this.addEvent();
        },
        //设置刷新的div样式
        setRefreshDiv:function(){
            this.refreshDom.css({
                position:"absolute",
                left:0,
                top:-this.refreshDomHeight + "px"
            });

            if(!DEVICE.checkDomHasPosition(this.body)){
                this.body.css({
                    position:"relative"
                })
            }

        },
        //事件监听
        addEvent:function(){
            var _this = this;
            document.addEventListener(DEVICE.START_EV,this.touchStartFn = function(e){
                _this.touchStart(e);
            },false);
            document.addEventListener(DEVICE.MOVE_EV,this.touchMoveFn = function(e){
                _this.touchMove(e);
            },false);
            document.addEventListener(DEVICE.END_EV,this.touchEndFn = function(){
                _this.touchEnd();
            },false);
        },


        touchStart:function(e){
            if(this.isRefreshing){return;}
            this.isTouch = true;
            this.clearPoint();
            this.savePoint(e);
        },
        touchMove:function(e){
            if(this.isRefreshing){return;}
            if(!this.isTouch){return;}
            this.savePoint(e);

            var l = this.points.length;
            if(l<2){return;}

            var s_y = this.points[l-2],
                e_y = this.points[l-1];


            if(this.state){
                if(this.state == "top"){
                    this.pullTop(e_y - s_y,e);
                }

                return;

            }


            //判断是否在下拉
            if(s_y < e_y){
                //下拉
                this.pullTop(e_y - s_y,e);
            }


        },
        touchEnd:function(){
            if(this.isRefreshing){return;}
            if(!this.isTouch){return;}
            if(!this.state){return;}

            var _this = this;


            if(this.state == "top"){

                if(this.y<=0){
                    _this.y = 0;
                    _this.state = null;
                    _this.backAnimateFn = null;
                    return;
                }


                //判断是否执行刷新  超过刷新dom的2/3高度
                var end = 0,
                    time = 400;
                if(this.y >= this.refreshDomHeight*2/3){
                    this.isRefreshing = true;
                    this.refreshFn();
                    end = this.refreshDomHeight*2/3;
                    time = 100;
                }




                //顶部刷新在显示，需要回滚
                this.backAnimateFn = new DEVICE.jsAnimate({
                    start:this.y,             //@param:number   初始位置
                    end:end,                    //@param:number   结束位置
                    time:time,                 //@param:number   动画执行时间  ms
                    type:"Cubic",             //@param:str      tween动画类别,默认：Linear 详见函数内tween函数
                    class:"easeIn",           //@param:str      tween动画方式,默认：easeIn 详见函数内tween函数
                    stepFn:function(val){     //@param:fn       每步执行函数,返回当前属性值
                        _this.y = val;
                        $(window).scrollTop(0);
                        _this.body.css3({
                            transform:"translate3d(0,"+_this.y+"px,0)"
                        });
                    },
                    endFn:function(){         //@param:fn       动画结束执行
                        _this.y = end;
                        _this.state = null;
                        _this.backAnimateFn = null;
                    },
                    alternate:false,          //@param:boolean  动画结束时是否反向运行，默认：false
                    infinite:false            //@param:boolean  动画是否循环执行，默认：false
                });

                this.backAnimateFn.play();
            }

        },
        //完全隐藏刷新dom
        hideLoading:function(){
            var _this = this;
            this.backAnimateFn = new DEVICE.jsAnimate({
                start:this.y,             //@param:number   初始位置
                end:0,                    //@param:number   结束位置
                time:400,                 //@param:number   动画执行时间  ms
                type:"Cubic",             //@param:str      tween动画类别,默认：Linear 详见函数内tween函数
                class:"easeIn",           //@param:str      tween动画方式,默认：easeIn 详见函数内tween函数
                stepFn:function(val){     //@param:fn       每步执行函数,返回当前属性值
                    _this.y = val;
                    $(window).scrollTop(0);
                    _this.body.css3({
                        transform:"translate3d(0,"+_this.y+"px,0)"
                    });
                },
                endFn:function(){         //@param:fn       动画结束执行
                    _this.y = 0;
                    _this.state = null;
                    _this.backAnimateFn = null;
                    _this.isRefreshing = false;
                },
                alternate:false,          //@param:boolean  动画结束时是否反向运行，默认：false
                infinite:false            //@param:boolean  动画是否循环执行，默认：false
            });
            this.backAnimateFn.play();
            this.refresh();
        },
        //记录触摸的点
        savePoint:function(e){
            var point = (e.touches)? e.touches[0] : e;

            var y = point.clientY;
            this.points.push(y);
        },
        //清空记录的点
        clearPoint:function(){
            this.points = [];
        },

        //刷新
        refresh:function(){

        },
        //上提
        pullBottom:function(){

        },
        //下拉
        pullTop:function(len,e){
            if($(window).scrollTop() != 0){
                return;
            }

            this.state = "top";

            this.y += len/2;
            this.y = (this.y > this.refreshDomHeight)? this.refreshDomHeight : this.y;

            if(this.y >= 0){
                e.stopPropagation();
                e.preventDefault();
                this.body.css3({
                    transform:"translate3d(0,"+this.y+"px,0)"
                });
            }

            if(this.y >= this.refreshDomHeight*2/3){
                this.nowRefreshCanRunFn();
            }else{
                this.nowRefreshNotCanRunFn();
            }

        },
        destroy:function(){
            document.removeEventListener(DEVICE.START_EV,this.touchStartFn,false);
            document.removeEventListener(DEVICE.MOVE_EV,this.touchMoveFn,false);
            document.removeEventListener(DEVICE.END_EV,this.touchEndFn,false);
            this.refreshDom.css({display:"none"});
        }

    };

    DEVICE.pullRefresh = pullRefresh;
})();




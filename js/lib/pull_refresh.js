/**
 * Created by beens on 15/12/18.
 */


//下拉刷新插件，自动屏幕浏览器顶部的自带事件（比如ios顶部的弹性回滚）
//ajax取数据成功失败都要执行相应的回调刷新页面(a.refreshComplete()或a.nextPageLoadComplete())


//a = new DEVICE.pullRefresh({
//    dom:$("#aaa"),           //@param:jqobj   跟随浏览器滑动的主体dom
//    refreshDom:div,          //@param:jqobj  下拉刷新时显示的div
//                                             该div会自动定位到主体dom的上方
//    refreshFn:function(){    //@param:fn      触发刷新时执行
//        div.text("正在加载")
//
//        setTimeout(function(){
//            a.refreshComplete();    //数据加载完成后调用该方法隐藏刷新时显示的dom
//        },3000)
//
//    },
//                                     //可释放刷新的点在refreshDom的2/3高度
//    nowRefreshCanRunFn:function(){   //拉动到可以释放刷新时执行的函数
//        div.text("释放刷新");
//    },
//    nowRefreshNotCanRunFn:function(){  //拉动到不可以释放刷新时执行的函数
//        div.text("下拉刷新");
//    },
//    nextPageDom:$("#ts1"),        //@param:jqobj 上啦加载下一页时显示的div
//                                                 该div会自动定位到主体dom的下方
//    nextPageFn:function(){         //@param:fn      触发加下下一页时执行
//        $("#ts1").text("正在加载")
//
//        setTimeout(function(){
//            var div = "adfasdf<br/>";
//            for(var i= 0,l=100;i<l;i++){
//                a.body.append(div);
//            }
//            a.nextPageLoadComplete();  //数据加载完成后调用该方法隐藏刷新时显示的dom
//        },3000)
//    },
//                                      //可释放的点在nextPageDom的2/3高度
//    nextPageCanRunFn:function(){      //拉动到可以释放加载下一页时执行的函数
//        $("#ts1").text("释放加载")
//    },
//    nextPageNotCanRunFn:function(){   //拉动到不可释放加载下一页时执行的函数
//        $("#ts1").text("上拉加载")
//    }



//});


//a.refreshComplete();          //数据加载完成后调用该方法隐藏刷新时显示的dom
//a.nextPageLoadComplete();     //数据加载完成后调用该方法隐藏下一页时显示的dom
//a.destroy();                  //销毁功能






(function(){
    var pullRefresh = function(opt){
        //刷新要显示的div
        this.refreshDom = opt.refreshDom;      //下拉刷新要显示的div  jqobj
        this.refreshFn = opt.refreshFn || function(){}; //刷新触发执行
        this.nextPageDom = opt.nextPageDom;     //上拉加载更多要显示的div jqobj
        this.nextPageFn = opt.nextPageFn || function(){};  //加载更多执行
        this.nowRefreshCanRunFn = opt.nowRefreshCanRunFn || function(){};
        this.nowRefreshNotCanRunFn = opt.nowRefreshNotCanRunFn || function(){};
        this.nextPageCanRunFn = opt.nextPageCanRunFn || function(){};
        this.nextPageNotCanRunFn = opt.nextPageNotCanRunFn || function(){};
        //要移动的主体
        this.body = opt.dom || $("body");   //滑动的主体 jqobj

        //移动块的外包裹层
        this.main = null;

        //判断是否已点击
        this.isTouch = false;
        //判断是否已经被下拉
        this.state = false;
        //判断是否正在从服务器请求数据
        this.isRefreshing = false;
        this.isNextPageing = false;
        //已修正的距离
        this.y = 0;
        //顶部刷新dom的高度
        this.refreshDomHeight = parseInt(this.refreshDom.height());
        this.nextPageDomHeight = parseInt(this.nextPageDom.height());
        this.maxScrollTop = null;
        this.canPullBottom = false;
        this.mainHeight = 0;
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
            this.setMainDiv();
            this.setRefreshDiv();
            this.setNextPageDiv();
            this.refresh();
            this.addEvent();
        },
        setMainDiv:function(){
            var div = $("<div></div>");
            div.css({
                width:"100%",
                overflow:"hidden"
            });
            div.insertAfter(this.body);
            div.append(this.body);

            this.main = div;
            if(!DEVICE.checkDomHasPosition(this.body)){
                this.body.css({
                    position:"relative"
                })
            }
        },
        //设置刷新的div样式
        setRefreshDiv:function(){
            this.refreshDom.css({
                position:"absolute",
                left:0,
                top:-this.refreshDomHeight + "px"
            });

            this.body.append(this.refreshDom);

        },
        //设置下拉加载的div样式
        setNextPageDiv:function(){
            this.nextPageDom.css({
                position:"absolute",
                left:0,
                bottom:-this.nextPageDomHeight + "px"
            });


            this.body.append(this.nextPageDom);
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
            document.addEventListener(DEVICE.END_EV,this.touchEndFn = function(e){
                _this.touchEnd();
            },false);
        },


        touchStart:function(e){
            if(this.isRefreshing || this.isNextPageing){return;}
            this.isTouch = true;
            this.clearPoint();
            this.savePoint(e);
        },
        touchMove:function(e){
            if(this.isRefreshing || this.isNextPageing){return;}
            if(!this.isTouch){return;}
            this.savePoint(e);

            var l = this.points.length;
            if(l<2){return;}

            var s_y = this.points[l-2],
                e_y = this.points[l-1];


            if(this.state){
                if(this.state == "top"){
                    this.pullTop(e_y - s_y,e);
                }else{
                    this.pullBottom(e_y - s_y,e);
                }
                return;

            }


            //判断是否在下拉
            if(s_y < e_y){
                //下拉
                this.pullTop(e_y - s_y,e);
            }else{
                //上提
                this.pullBottom(e_y - s_y,e);
            }


        },
        touchEnd:function(){
            if(this.isRefreshing || this.isNextPageing){return;}
            if(!this.isTouch){return;}
            if(!this.state){return;}

            if(this.state == "top"){
                this.refreshTouchEnd();

            }else{
                this.nextPageTouchEnd();
            }


        },
        refreshTouchEnd:function(){
            var _this = this;

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

            if(end !=0){
                var height = this.mainHeight+this.refreshDomHeight*2/3;
                this.main.css({height:height+"px"});
            }


        },
        nextPageTouchEnd:function(){
            var _this = this;

            if(this.y>=0){
                _this.y = 0;
                _this.state = null;
                _this.backAnimateFn = null;
                return;
            }


            //判断是否执行刷新  超过下一页dom的2/3高度
            var end = 0,
                time = 400;
            if(Math.abs(this.y) >= this.nextPageDomHeight*2/3){
                this.isNextPageing = true;
                this.nextPageFn();
                end = -this.nextPageDomHeight*2/3;
                time = 100;
            }




            //底部加载在显示，需要回滚
            this.backAnimateFn = new DEVICE.jsAnimate({
                start:this.y,             //@param:number   初始位置
                end:end,                    //@param:number   结束位置
                time:time,                 //@param:number   动画执行时间  ms
                type:"Cubic",             //@param:str      tween动画类别,默认：Linear 详见函数内tween函数
                class:"easeIn",           //@param:str      tween动画方式,默认：easeIn 详见函数内tween函数
                stepFn:function(val){     //@param:fn       每步执行函数,返回当前属性值
                    _this.y = val;
                    $(window).scrollTop(this.maxScrollTop);
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
            if(end != 0){
                var height = this.mainHeight + this.nextPageDomHeight*2/3;
                this.main.css({height:height+"px"});
                this.body.css({"padding-top":this.nextPageDomHeight*2/3+"px"});
                var top = $(window).scrollTop() + this.nextPageDomHeight*2/3;
                $(window).scrollTop(top);
            }
        },
        //完全隐藏刷新dom
        refreshComplete:function(){
            var _this = this;
            this.backAnimateFn = new DEVICE.jsAnimate({
                start:this.y,             //@param:number   初始位置
                end:0,                    //@param:number   结束位置
                time:400,                 //@param:number   动画执行时间  ms
                type:"Cubic",             //@param:str      tween动画类别,默认：Linear 详见函数内tween函数
                class:"easeIn",           //@param:str      tween动画方式,默认：easeIn 详见函数内tween函数
                stepFn:function(val){     //@param:fn       每步执行函数,返回当前属性值
                    _this.y = val;
                    //$(window).scrollTop(0);
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
        nextPageLoadComplete:function(){
            var _this = this;
            //this.backAnimateFn = new DEVICE.jsAnimate({
            //    start:this.y,             //@param:number   初始位置
            //    end:0,                    //@param:number   结束位置
            //    time:400,                 //@param:number   动画执行时间  ms
            //    type:"Cubic",             //@param:str      tween动画类别,默认：Linear 详见函数内tween函数
            //    class:"easeIn",           //@param:str      tween动画方式,默认：easeIn 详见函数内tween函数
            //    stepFn:function(val){     //@param:fn       每步执行函数,返回当前属性值
            //        _this.y = val;
            //        //$(window).scrollTop(this.maxScrollTop);
            //        _this.body.css3({
            //            transform:"translate3d(0,"+_this.y+"px,0)"
            //        });
            //    },
            //    endFn:function(){         //@param:fn       动画结束执行
            //        _this.y = 0;
            //        _this.state = null;
            //        _this.backAnimateFn = null;
            //        _this.isNextPageing = false;
            //    },
            //    alternate:false,          //@param:boolean  动画结束时是否反向运行，默认：false
            //    infinite:false            //@param:boolean  动画是否循环执行，默认：false
            //});
            //this.backAnimateFn.play();
            this.refresh();

            //var top = $(window).scrollTop()+_this.nextPageDomHeight*2/3;
            _this.body.css3({
                transform:"translate3d(0,0,0)"
            });
            //$(window).scrollTop(top);
            _this.y = 0;
            _this.state = null;
            _this.backAnimateFn = null;
            _this.isNextPageing = false;

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
            this.mainHeight = parseInt(this.body.height());
            this.main.css({height:this.mainHeight+"px"});
            this.maxScrollTop = parseInt($("body").height()) - window.innerHeight;
            this.canPullBottom = (this.maxScrollTop>0);
            this.body.css({"padding-top":0});

        },
        //上提
        pullBottom:function(len,e){
            if(!this.canPullBottom){return;}
            if($(window).scrollTop() != this.maxScrollTop){return;}

            this.state = "bottom";

            this.y += len/2;
            this.y = (Math.abs(this.y) > this.nextPageDomHeight)? -this.nextPageDomHeight : this.y;

            if(this.y <= 0){
                e.stopPropagation();
                e.preventDefault();
                this.body.css3({
                    transform:"translate3d(0,"+this.y+"px,0)"
                });
            }

            if(Math.abs(this.y) >= this.nextPageDomHeight*2/3){
                this.nextPageCanRunFn();
            }else{
                this.nextPageNotCanRunFn();
            }

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
            this.nextPageDom.css({display:"none"});
        }

    };

    DEVICE.pullRefresh = pullRefresh;
})();




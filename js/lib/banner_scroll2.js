/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-8-14
 * Time: 上午10:41
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */



//banner滚动效果，显示3张循环立体效果
//依赖  touch_slide_event.js   animate_css.js

//new DEVICE.productChange({
//    body:$("div"),               //@param:jqobj   包裹容器
//    lists:$("div").find("a"),    //@param:jqobj   要滚动的元素
//    perspective:200              //@param:number  视距
//});





DEVICE.productChange = (function(){
    var banner = function(opt){
        this.body = opt.body;
        this.lists = opt.lists || [];
        this.perspective = opt.perspective || 200;

        this.pointBg = "#fff";
        this.pointSelectBg = "#666";

        this.itemWidth = parseInt(this.lists.width());
        this.itemHeight = parseInt(this.lists.height());
        this.bodyWidth = parseInt(this.body.width());

        var left = (this.bodyWidth - this.itemWidth)/2 + this.itemWidth/ 3,
            right = this.bodyWidth - this.itemWidth*2/3 - (this.bodyWidth - this.itemWidth)/ 2,
            z = 50,
            deg = 10;

        this.param = [
            {
                deg:deg*2,
                z:-z*2,
                x:-left*3
            },
            {
                deg:deg,
                z:-z,
                x:-left
            },
            {
                deg:0,
                z:0,
                x:0
            },
            {
                deg:-deg,
                z:-z,
                x:right
            },
            {
                deg:-deg*2,
                z:-z*2,
                x:right*3
            }

        ];

        this.container = null;          //包裹层
        this.nowPage = 0;
        this.maxPage = this.lists.length - 1;

        this.hideDom = null;
        this.leftDom = null;
        this.centerDom = null;
        this.rightDom = null;
        this.points = null;
        this.pointBody = null;

        this.animateFn = null;

        this.init();

    };
    banner.prototype = {
        init:function(){
            this.createDiv();
            this.setCss();
            this.setListCss();
            this.createDian();
            this.addEvent();

        },
        //创建包裹层
        createDiv:function(){
            var div = $("<div></div>");
            div.css3({
                "transform-style": "preserve-3d",
                position:"relative",
                width:"100%",
                height:"100%"
            });
            div.append(this.lists);
            this.body.append(div);
            this.container = div;
        },
        //设置主体css
        setCss:function(){
            this.body.css3({
                perspective: this.perspective+"px",
                "perspective-origin":"50% 50%",
                overflow:"hidden"
            });
        },
        //获取转动元素的css
        getListCss:function(number){
            var param = this.param[number];

            return {
                transform:"rotateY("+param.deg+"deg) translate3d("+param.x+"px,0,"+param.z+"px)"
            }
        },
        //设置列表css
        setListCss:function(){
            this.lists.css({
                position:"absolute",
                left:"50%",
                top:"50%",
                "margin-left":-this.itemWidth/2 + "px",
                "margin-top":-this.itemHeight/2 + "px",
                webkitBackfaceVisibility:"hidden",
                "transform-style": "preserve-3d"
            });

            var _this = this;
            this.lists.each(function(i){
                if(i==0){
                    _this.lists.eq(i).css3(_this.getListCss(2));
                }else if(i==1){
                    _this.lists.eq(i).css3(_this.getListCss(3));
                }else if(i==_this.lists.length-1){
                    _this.lists.eq(i).css3(_this.getListCss(1));
                }else{
                    _this.lists.eq(i).css({display:"none"});
                }

            });
        },
        addEvent:function(){
            var _this = this,
                win_width = window.innerWidth;

            new DEVICE.touchSlideEvent({
                dom:this.body,
                startFn:function(){
                    _this.lists.css({
                        "will-change": "transform"
                    })
                },
                moveFn:function(p){
                    var len = p.move.x,
                        pre = len/win_width;

                    _this.move(pre);

                },
                endFn:function(p,slide){
                    var len = p.move.x,
                        pre = len/win_width,
                        math_pre = Math.abs(pre);

                    if(math_pre>=0.5 && !slide){
                        if(pre>0){
                            _this.move(1,true);
                        }else{
                            _this.move(-1,true);
                        }
                    }else{
                        _this.moveBack(pre);
                    }
                },
                slideLeftFn:function(){_this.move(-1,true);},
                slideRightFn:function(){_this.move(1,true);},
                slideMaxTime:500,
                useDirection:"x"
            });
        },
        move:function(pre,isAnimate){
            if(pre>0){
                //右滑
                this.rightMove(Math.abs(pre),isAnimate);
            }else{
                //左滑
                this.leftMove(Math.abs(pre),isAnimate);
            }
        },
        getMovingStyle:function(pre,start,end){
            var s_param = this.param[start],
                e_param = this.param[end],
                deg = (e_param.deg - s_param.deg)*pre + s_param.deg,
                x = (e_param.x - s_param.x)*pre + s_param.x,
                z = (e_param.z - s_param.z)*pre + s_param.z;

            return {
                transform:"rotateY("+deg+"deg) translate3d("+x+"px,0,"+z+"px)"
            }

        },
        leftMove:function(pre,isAnimate,callback){
            var n1 = (this.nowPage -1 < 0)? this.maxPage : this.nowPage - 1,
                n2 = this.nowPage,
                n3 = (this.nowPage + 1 > this.maxPage)? 0 : this.nowPage + 1,
                n4 = (n3 + 1 > this.maxPage)? 0 : n3 + 1,
                dom1 = this.lists.eq(n1),
                dom2 = this.lists.eq(n2),
                dom3 = this.lists.eq(n3),
                dom4 = this.lists.eq(n4).css3(this.getListCss(4)).css({display:"block"});
            callback = callback || function(){};


            if(!isAnimate){
                dom1.css3(this.getMovingStyle(pre,1,0));
                dom2.css3(this.getMovingStyle(pre,2,1));
                dom3.css3(this.getMovingStyle(pre,3,2));
                dom4.css3(this.getMovingStyle(pre,4,3));
                return;
            }

            var _this = this;
            //setTimeout(function(){
            dom1.cssAnimate(_this.getListCss(0),500,function(){
                dom1.css({display:"none"});
                callback();
            });
            dom2.cssAnimate(_this.getListCss(1),500);
            dom3.cssAnimate(_this.getListCss(2),500);
            dom4.cssAnimate(_this.getListCss(3),500);
            _this.nowPage++;
            _this.nowPage = (_this.nowPage>_this.maxPage)? 0 : _this.nowPage;
            _this.setPoints();
            //},0);

        },
        rightMove:function(pre,isAnimate,callback){
            var n1 = (this.nowPage -1 < 0)? this.maxPage : this.nowPage - 1,
                n0 = (n1 - 1 <0)? this.maxPage : n1 -1,
                n2 = this.nowPage,
                n3 = (this.nowPage + 1 > this.maxPage)?  0 : this.nowPage + 1,
                dom0 = this.lists.eq(n0).css3(this.getListCss(0)).css({display:"block"}),
                dom1 = this.lists.eq(n1),
                dom2 = this.lists.eq(n2),
                dom3 = this.lists.eq(n3);
            callback = callback || function(){};

            if(!isAnimate) {
                dom0.css3(this.getMovingStyle(pre, 0, 1));
                dom1.css3(this.getMovingStyle(pre, 1, 2));
                dom2.css3(this.getMovingStyle(pre, 2, 3));
                dom3.css3(this.getMovingStyle(pre, 3, 4));
                return;
            }

            var _this = this;
            //setTimeout(function(){
            dom0.cssAnimate(_this.getListCss(1),500);
            dom1.cssAnimate(_this.getListCss(2),500);
            dom2.cssAnimate(_this.getListCss(3),500);
            dom3.cssAnimate(_this.getListCss(4),500,function(){
                dom3.css({display:"none"});
                callback();
            });

            _this.nowPage--;
            _this.nowPage = (_this.nowPage<0)? _this.maxPage : _this.nowPage;
            _this.setPoints();
            //},0)

        },
        moveBack:function(pre){
            var time = Math.abs(pre) * 500;

            var n0,n1,n2,n3,n4,dom0,dom1,dom2,dom3,dom4;
            if(pre>0){
                //右滑回退
                n1 = (this.nowPage -1 < 0)? this.maxPage : this.nowPage - 1;
                n0 = (n1 - 1 <0)? this.maxPage : n1 -1;
                n2 = this.nowPage;
                n3 = (this.nowPage + 1 > this.maxPage)?  0 : this.nowPage + 1;
                dom0 = this.lists.eq(n0).css3(this.getListCss(0));
                dom1 = this.lists.eq(n1);
                dom2 = this.lists.eq(n2);
                dom3 = this.lists.eq(n3);

                dom0.cssAnimate(this.getListCss(0),time,function(){dom0.css({display:"none"})});
                dom1.cssAnimate(this.getListCss(1),time);
                dom2.cssAnimate(this.getListCss(2),time);
                dom3.cssAnimate(this.getListCss(3),time);
            }else{
                //左滑回退
                n1 = (this.nowPage -1 < 0)? this.maxPage : this.nowPage - 1;
                n2 = this.nowPage;
                n3 = (this.nowPage + 1 > this.maxPage)? 0 : this.nowPage + 1;
                n4 = (n3 + 1 > this.maxPage)? 0 : n3 + 1;
                dom1 = this.lists.eq(n1);
                dom2 = this.lists.eq(n2);
                dom3 = this.lists.eq(n3);
                dom4 = this.lists.eq(n4).css3(this.getListCss(4));

                dom1.cssAnimate(this.getListCss(1),500);
                dom2.cssAnimate(this.getListCss(2),500);
                dom3.cssAnimate(this.getListCss(3),500);
                dom4.cssAnimate(this.getListCss(4),500,function(){dom4.css({display:"none'"})});
            }

            this.lists.css({
                "will-change":"auto"
            })
        },
        createDian:function(){
            var _this = this;

            var div = $("<div></div>"),
                width = _this.lists.length * 20,
                display = "block";
            div.css({
                width: width + "px",
                height: "10px",
                position: "absolute",
                bottom: "10px",
                left: "50%",
                "margin-left": -width / 2 + "px",
                display:display,
                "z-index":9999
            });


            var span = $("<div></div>");
            span.css({
                width: "8px",
                height: "8px",
                margin: "0 5px",
                background: this.pointBg,
                "border-radius": "5px",
                float: "left",
                border:"1pt solid transparent"
            });

            for (var i = 0, l = this.lists.length; i < l; i++) {
                var this_item = span.clone().attr({ n: i });
                if (i == 0) {
                    this_item.css({ background: this.pointSelectBg,"border-color":"#fff" })
                }
                div.append(this_item);
            }
            this.points = div.find("div");
            this.pointBody = div;

            this.body.append(div)
        },
        setPoints:function(){
            this.points.css({background:this.pointBg,border:"1pt solid transparent"});
            this.points.eq(this.nowPage).css({background:this.pointSelectBg,"border-color":"#fff"})
            this.lists.css({
                "will-change":"auto"
            })
        }


    };

    return banner;
})();




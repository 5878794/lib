/**
 * Created by beens on 15/11/6.
 */


//banner切换效果 未最终完成一些小的细节，已可用


DEVICE.bannerAnimate1 = (function(){
    var banner = function(opt){
        this.dom = opt.dom;
        this.items = opt.items || this.dom.find("a");
        this.changeTime = opt.changeTime || 5000;

        this.has3d = DEVICE.has3d;
        this.backgroundCss = [];
        this.runFn = null;
        this.maxN = this.items.length;
        this.n = -1;

        this.init();
    };
    banner.prototype = {
        init:function(){
            this.setStyle();
            this.getBackgroundCss();
            this.run();
            this.addEvent();
        },
        setStyle:function(){
            if(!DEVICE.checkDomHasPosition(this.dom)){
                this.dom.css({position:"relative",overflow:"hidden"});
            }else{
                this.dom.css({overflow:"hidden"});
            }
            this.items.css({
                display:"none",width:"100%",height:"100%",
                position:"absolute",left:0,top:0,"z-index":10
            }).eq(0).css({
                display:"block"
            })
        },
        getBackgroundCss:function(){
            var _this = this;
            this.items.each(function(){
                _this.backgroundCss.push($(this).css("background"));
            })
        },
        run:function(){
            var _this = this,
                _number = 0;

            var fn = function(){
                _this.runFn = setTimeout(function(){
                    _this.n++;
                    _this.n = (_this.n>=_this.maxN)? 0 : _this.n;

                    var hideN = _this.n,
                        showN = _this.n+1;
                    showN = (showN >= _this.maxN)? 0 : showN;

                    var number = parseInt(Math.random()*5)+ 1;

                    if(number == _number){
                        number++;
                        number = (number>5)? 1 : number;
                    }
                    _number = number;


                    _this.animate(hideN,showN,number);

                    fn();
                },_this.changeTime);
            };
            fn();
        },
        createTwoDiv:function(bg){
            var div1 = $("<div class='___temp___'></div>"),
                div2 = $("<div class='___temp___'></div>");
            div1.css({
                background:bg,
                width:"50%",
                height:"100%",
                position:"absolute",
                left:0,top:0,
                "padding-right":"50%",
                "background-clip":"content-box",
                "z-index":"2"
            });
            div2.css({
                background:bg,
                width:"50%",
                height:"100%",
                position:"absolute",
                left:0,top:0,
                "padding-left":"50%",
                "background-clip":"content-box",
                "z-index":"1"
            });
            return {
                div1:div1,
                div2:div2
            }
        },
        getTranslateValue:function(number){
            //第一个代表左边  第二个代表右边
            switch(number){
                case 1:
                    //左上右下 分开
                    return {
                        div1:{
                            time:100,       //延迟执行时间
                            val:"0,-100%"   //位移 xy坐标
                        },
                        div2:{
                            time:400,
                            val:"0,100%"
                        }
                    };
                case 2:
                    //左下右上 分开
                    return {
                        div1: {
                            time: 100,
                            val: "0,100%"
                        },
                        div2: {
                            time: 400,
                            val: "0,-100%"
                        }
                    };
                case 3:
                    //左右2边分开
                    return {
                        div1: {
                            time: 100,
                            val: "-50%,0"
                        },
                        div2: {
                            time: 400,
                            val: "50%,0"
                        }
                    };
                case 4:
                    //全部向右
                    return {
                        div1: {
                            time: 100,
                            val: "100%,0"
                        },
                        div2: {
                            time: 200,
                            val: "100%,0"
                        }
                    };
                case 5:
                    //全部向左
                    return {
                        div1: {
                            time: 100,
                            val: "-100%,0"
                        },
                        div2: {
                            time: 100,
                            val: "-100%,0"
                        }
                    };
                default :
                    //左上右下 分开
                    return {
                        div1:{
                            time:100,
                            val:"0,-100%"
                        },
                        div2:{
                            time:400,
                            val:"0,100%"
                        }
                    };
            }

        },
        animate:function(hideN,showN,number){
            var bg = this.backgroundCss[this.n],
                divs = this.createTwoDiv(bg),
                div1 = divs.div1,
                div2 = divs.div2,
                hideItem = this.items.eq(hideN),
                showItem = this.items.eq(showN),
                z = (this.has3d)? ",0" : "",
                time = 1000,
                translate = (this.has3d)? "translate3d" : "translate",
                val = this.getTranslateValue(number),
                _this = this;

            showItem.css({display:"block","z-index":"10"});
            hideItem.append(div1).append(div2).css({
                background:"none",
                "z-index":20
            });
            setTimeout(function(){
                div1.cssAnimate({
                    transform:translate+"("+val.div1.val+z+")"
                },time,function(){},true,"ease");
            },val.div1.time);
            setTimeout(function(){
                div2.cssAnimate({
                    transform:translate+"("+val.div2.val+z+")"
                },time,function(){
                    setTimeout(function(){
                        _this.items.eq(hideN).find(".___temp___").remove();
                        hideItem.css({background:bg,display:"none"});
                    },0);
                },true,"ease");
            },val.div2.time);
        },
        addEvent:function(){
            var _this = this;
            document.addEventListener('visibilitychange', function(e) {
                if(document.hidden){
                    //最小化  停止定时器
                    clearTimeout(_this.runFn)
                }else{
                    //显示   启动定时器
                    clearTimeout(_this.runFn);
                    _this.run();
                }
            }, false);
        }
    };

    return banner;
})();



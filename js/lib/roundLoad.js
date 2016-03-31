/**
 * Created by beens on 15/10/28.
 */


//画一个圆，主要用于loading动画   dom模拟的，建议不用了改用svg
//var a = new DEVICE.roundLoad({
//    body:$("#div"),         //@param：jqpbj  要在哪个容器内画，会自动根据该容器的宽高计算半径
//    startRotate:90,         //@param：number 初始从多少度开始画，默认90
//    borderColor:"#f00",     //@param: string 边框的颜色
//    background:"yellow"     //@param: string 背景颜色，默认透明的
//});
////开始画
//a.showPro(pre);             //@param: number 0-100  进度的比例，调用一次画一段



DEVICE.roundLoad = function(opt){
    this.body = opt.body;
    this.startRotate = opt.startRotate || 90;
    this.borderColor = opt.borderColor || "red";
    this.background = opt.background || "transparent";

    if(this.body.length != 1){
        throw "counter is not define!";
    }
    this.bodyWidth = parseInt(this.body.width());
    this.bodyHeight = parseInt(this.body.height());
    this.r = (this.bodyWidth > this.bodyHeight)? this.bodyHeight : this.bodyWidth;

    this.topDiv = null;
    this.bottomDiv = null;
    this.mainDiv = null;

    this.first50 = false;
    this.runTimeout = false;

    this.init();
};
DEVICE.roundLoad.prototype = {
    init:function(){
        this.setBodyCss();
        this.createDom();
    },
    //设置容器相对定位
    setBodyCss:function(){
        var position = this.body.css("position");
        if(position == "absolute" || position=="fixed" || position == "relative"){

        }else{
            this.body.css({
                position:"relative"
            })
        }

    },
    //创建dom
    createDom:function(){
        var main = $("<div></div>"),
            top = $("<div></div>"),
            bottom = $("<div></div>"),
            top_div = $("<div></div>"),
            bottom_div = $("<div></div>"),
            top_country = $("<div></div>"),
            bottom_country = $("<div></div>");

        main.css3({
            position:"absolute",
            left:0,top:0,
            width:this.bodyWidth+"px",height:this.bodyHeight+"px",
            transform:"rotate("+this.startRotate+"deg)"
        });


        top.css({
            width:this.r+"px",
            height:this.r/2+"px",
            position:"absolute",
            left:"50%","margin-left":-this.r/2+"px",
            top:0,"margin-top":-(this.bodyHeight-this.r)/2+"px",
            overflow:"hidden"



        });
        bottom.css({
            width:this.r+"px",height:this.r/2+"px",
            left:"50%","margin-left":-this.r/2+"px",
            top:"50%","margin-top":-(this.bodyHeight-this.r)/2-1+"px",
            position:"absolute",
            overflow:"hidden"
        });

        var div_css = {
            width:this.r+"px",
            height:this.r+"px",
            background:this.background,
            border:"10px solid "+this.borderColor,
            "border-radius":this.r+"px",
            "box-sizing":"border-box"
        };
        var country_css = {
            width:this.r+"px",
            height:this.r/2+"px",
            overflow:"hidden",
            clip:"rect(0,"+this.r+"px,"+this.r/2+"px,0)"
        };


        //clip属性只对其子元素有效果，所有多了一层包裹层
        top_country.css(country_css).css3({
            "transform-origin":"center bottom",
            transform:"rotate(180deg)",
            transition:"all 500ms linear"
        });
        bottom_country.css(country_css).css3({
            "transform-origin":"top center",
            transform:"rotate(180deg)",
            transition:"all 500ms linear"
        });
        top_div.css3(div_css);
        bottom_div.css3(div_css).css({"margin-top":"-50%"});

        top_country.append(top_div);
        bottom_country.append(bottom_div);
        top.append(top_country);
        bottom.append(bottom_country);
        main.append(top).append(bottom);

        this.body.append(main);

        this.topDiv = top_country;
        this.bottomDiv = bottom_country;
    },
    //显示进度
    showPro:function(pre){
        var deg1 = 180,
            deg2 = 180,
            deg = pre*3.6,
            _this = this;

        deg = (deg > 360)? 360 : deg;
        deg = (deg < 0)? 0 : deg;

        var run = function(deg1,deg2){
            _this.topDiv.css3({
                transform:"rotate("+deg1+"deg)"
            });

            if(deg2){
                _this.bottomDiv.css3({
                    transform:"rotate("+deg2+"deg)"
                })
            }

        };


        //第一次超过50%需要settimeout延迟，否则有可能上半部分还没动画完成，下半部分就开始了



        if(deg <= 180){
            //只处理上面的div
            deg1 += deg;
            run(deg1,deg2);
        }else{
            //只处理下面的div
            deg1 = 360;
            deg2 = deg;

            if(deg != 360){
                if(this.runTimeout){return;}
                if(!this.first50){
                    this.runTimeout = true;
                    run(deg1);
                    setTimeout(function(){
                        _this.first50 = true;
                        _this.runTimeout = false;
                        run(deg1,deg2);
                    },500)
                }else{
                    run(deg1,deg2);
                }
            }else{
                run(deg1);
                setTimeout(function(){
                    run(deg1,deg2);
                },500);
            }
        }



    },
    destroy:function(){
        this.mainDiv.remove();

    }
};
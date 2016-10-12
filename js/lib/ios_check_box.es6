
//ios的checkbox的  开关按钮

//new DEVICE.iosCheckBox({
//    dom:$("body"),                    //要放置的容器
//    isCheck:false,                    //默认状态是否选中
//    selectBg:"green",                 //选中后的边框颜色
//    bg:"#ccc",                        //未选中的边框颜色
//    btnBg:"#fff",                     //圆形按钮的颜色
//    btnBodyBg:"#eee",                 //关闭时圆形按钮外的背景色
//    borderWidth:3,                    //边框厚度  px
//    spd:400,                          //动画速度
//    callback:function(state){         //点击执行
//        console.log(state);           //输出选中状态 true /false
//    }
//});





DEVICE.iosCheckBox = class checkBox{
    constructor(opt){
        this.dom = opt.dom;         //要放置的容器
        this.isCheck = opt.isCheck || false;       //默认状态是否选中
        this.selectBg = opt.selectBg || "green";        //选中后的边框颜色
        this.bg = opt.bg || "#ccc";                     //未选中的边框颜色
        this.btnBg = opt.btnBg || "#fff";               //圆形按钮的颜色
        this.btnBodyBg = opt.btnBodyBg || "#eee";       //关闭时圆形按钮外的背景色
        this.borderWidth = opt.borderWidth || "3";      //边框宽度  px
        this.spd = opt.spd || 400;                      //动画速度
        this.callback = opt.callback || function(){};   //按钮点击后的回调

        this.width = parseInt(this.dom.width());
        this.height = parseInt(this.dom.height());
        this.body = null;
        this.btnBody = null;
        this.btn = null;
        this.btnBgDom = null;

        if(this.height>this.width){
            console.log("容器非长方形，切宽必须大于高");
            return;
        }

        this.state = false;
        this.isAnimate = false;

        this._init();
    }

    _init(){
        this._createDom();
        this._createBtn();
        this._addEvent();

        if(this.isCheck){
            this._animate();
        }

    }

    _createDom(){

        if(!DEVICE.checkDomHasPosition(this.dom)){
            this.dom.css({
                position:"relative"
            })
        }

        let div = $("<div></div>");
        div.css3({
            width:"100%",
            height:"100%",
            position:"absolute",
            top:0,left:0,
            "box-sizing":"border-box",
            border:this.borderWidth+"px solid "+this.bg,
            "border-radius":this.height+this.borderWidth*2+"px",
            "overflow":"hidden",
            background:this.selectBg
        });

        this.body = div;

        this.dom.append(div);
    }

    _createBtn(){
        let body = $("<div></div>");
        body.css3({
            width:this.width+"px",
            height:this.height+"px",
            position:"absolute",
            left:0,
            top:0
        });


        let div = $("<div></div>");
        div.css3({
            width:this.height-this.borderWidth*2+"px",
            height:this.height-this.borderWidth*2+"px",
            background:this.btnBg,
            "box-sizing":"border-box",
            "border-radius":this.height+"px",
            //border:this.borderWidth+"px solid "+this.bg,
            position:"absolute",
            "box-shadow":this.borderWidth*2+"px "+this.borderWidth+"px "+this.borderWidth+"px "+this.bg,
            left:0,
            top:0,
            "z-index":100
        });

        let div1 = $("<div></div>");
        div1.css3({
            width:this.width+"px",
            height:this.height+"px",
            "font-size":"0",
            position:"absolute",
            left:0,
            top:"50%",
            "margin-top":-this.height/2+"px",
            background:this.btnBodyBg,
            "z-index":80,
            "border-radius":this.height+"px"
        });

        body.append(div).append(div1);

        this.btnBody = body;
        this.btn = div;
        this.btnBgDom = div1;

        this.body.append(body);
    }


    _addEvent(){
        let _this = this;
        this.dom.get(0).addEventListener(DEVICE.START_EV,function(){
            _this._animate();
        },false);
    }

    _animate(){
        var _this = this;

        if(this.isAnimate){return;}

        this.isAnimate = true;
        let l = this.width - this.height;

        if(!this.state){
            this.body.css({
                border:this.borderWidth+"px solid "+this.selectBg
            });
            this.btnBgDom.cssAnimate({
                width:this.height+"px",
                height:0,
                "margin-top":0,
                opacity:0
            },this.spd,function(){},false,"easein","transform");
            this.btnBody.cssAnimate({
                transform:"translateX("+l+"px"+")"
            },this.spd,function(){
                _this.state = true;
                _this.isAnimate = false;
                _this.callback(true);
            },false,"easein","transform")
        }else{
            this.body.css({
                border:this.borderWidth+"px solid "+this.bg
            });
            this.btnBgDom.cssAnimate({
                width:this.width+"px",
                height:this.height+"px",
                "margin-top":-this.height/2+"px",
                opacity:1
            },this.spd,function(){},false,"easein","transform");
            this.btnBody.cssAnimate({
                transform:"translateX(0)"
            },this.spd,function(){
                _this.state = false;
                _this.isAnimate = false;
                _this.callback(false);
            },false,"easein","transform")
        }
    }
};
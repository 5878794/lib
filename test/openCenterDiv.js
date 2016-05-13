/**
 * Created by beens on 16/5/13.
 */


//打开div  居中显示
//new DEVICE.openCenterDiv({
//    id:"test",            //要打开的div的id
//    width:"500",          //要打开的div的宽度
//    title:"测试标题"       //窗口标题显示
//});



if(!window.DEVICE){window.DEVICE = {}}


DEVICE.openCenterDiv = function(opt){
    this.width = opt.width || 500;
    this.id = opt.id;
    this.title = opt.title || "";

    this.bgDom =  null;
    this.mainDom = null;
    this.closeDom = null;
    this.titleDom = null;
    this.bodyDom = null;

    this._init();
};
DEVICE.openCenterDiv.prototype = {
    _init:function(){
        this._createBg();
        this._createMain();
        this._createTitle();
        this._createBody();
        this._addEvent();
        this._openDiv();
    },
    _createBg:function(){
        var div = $("<div></div>");
        div.css({
            width:"100%",
            height:"100%",
            background:"rgba(0,0,0,0)",
            position:"fixed",
            left:0,top:0,
            overflow:"hidden",
            "z-index":99999,
            display:"none"
        });
        this.bgDom = div;

        $("body").append(div);
    },
    _createMain:function(){
        var main = $("<div></div>");
        main.css({
            width:this.width+"px",
            background:"#fff",
            padding:"20px",
            position:"fixed",
            left:"50%",top:"50%",
            "z-index":"100000",
            display:"none"
        });
        this.mainDom = main;
        $("body").append(main);
    },
    _createTitle:function(){
        var title = $("<div></div>");
        title.css({
            height:"30px",
            "line-height":"30px",
            "font-size":"26px",
            padding:"15px",
            background:"#eeeeee"
        });

        var line = $("<div></div>");
        line.css({
            width:"10px",
            height:"30px",
            "border-left":"4px solid #00abeb",
            "font-size":0,
            "-webkit-text-size-adjust": "none",
            float:"left"
        });
        title.append(line);

        var text = $("<span></span>");
        text.css({
           float:"left"
        });
        this.titleDom = text;
        title.append(text);

        var close = $("<span>关闭</span>");
        close.css({
            color:"#00abeb",
            "font-size":"14px",
            cursor:"pointer",
            float:"right",
            height:"30px",
            display:"inline-block",
            width:"40px"
        });
        title.append(close);
        this.closeDom = close;

        this.mainDom.append(title);
    },
    _createBody:function(){
        var div = $("<div></div>");
        div.css({
            "min-height":"100px",
            "padding-top":"20px"
        });
        this.bodyDom = div;
        this.mainDom.append(div);
    },
    _addEvent:function(){
        var _this = this;
        this.closeDom.click(function(){
            _this.closeDiv();
        });
        this.bgDom.click(function(){
            _this.closeDiv();
        });
        this.mainDom.click(function(e){
            e.stopPropagation();
            e.preventDefault();
        });

    },
    closeDiv:function(){
        var dom = this.bodyDom.children();
        dom.css({display:"none"});
        $("body").append(dom);
        this._destroy();
    },
    _openDiv:function(){
        var dom = $("#"+this.id);
        this.bodyDom.append(dom);
        dom.css({display:"block"});
        this.titleDom.text(this.title);

        this.bgDom.css({
            display:"block",
            background:"rgba(0,0,0,0.6)"
        });
        this.mainDom.css({
            display:"block",
            opacity:0
        });

        var _this = this;
        setTimeout(function(){
             var height = parseInt(_this.mainDom.outerHeight()),
                 width = parseInt(_this.mainDom.outerWidth());

            _this.mainDom.css({
                opacity:1,
                "margin-left":-width/2+"px",
                "margin-top":-height/2+"px"
            })
        },0);
    },
    _destroy:function(){
        this.closeDom.unbind("click");
        this.bgDom.unbind("click");
        this.mainDom.unbind("click");
        this.bgDom.remove();
        this.mainDom.remove();
    }
};
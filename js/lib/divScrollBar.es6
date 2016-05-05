
//TODO
//resize
//destroy
//滚动条与滚动巢间歇点击会触发滚动
//鼠标指针，滚动条屏蔽全选



DEVICE.divScrollBar = class divScrollBar{
    constructor(opt){
        this.id = opt.id;
        this.background = opt.background || "#ececec";
        this.color = opt.color || "#333";
        this.opacity = opt.opacity || 0.8;
        this.scrollBarWidth = opt.scrollBarWidth || 12;

        //PARAM
        this.scrollTop = 0;
        this.scrollLeft = 0;
        this.maxScrollTop = 0;
        this.maxScrollLeft = 0;
        this.scrollXLength = 0;
        this.scrollYLength = 0;

        this.hasMouseDownX = false;
        this.hasMouseDownY = false;
        this.startMousePointX = 0;
        this.startMousePointY = 0;

        this.htmlWidth = 0;
        this.htmlHeight = 0;
        this.bodyWidth = 0;
        this.bodyHeight = 0;

        this.isShowScrollX = false;
        this.isShowScrollY = false;

        //DOM
        this.dom = $("#"+this.id);
        this.html = null;
        this.body = null;
        this.scrollBarX = null;
        this.scrollerX = null;
        this.scrollBarY = null;
        this.scrollerY = null;




        this._init();
    }

    _init(){
        this._createDom();
        this._createScrollY();
        this._createScrollX();
        this._refresh();
        this._addEventListener();


    }

    _createDom(){
        this.dom.css({
            position:"relative"
        });

        let div = $("<div></div>"),
            div1 = $("<div></div>");

        div.css({
            position:"absolute",
            //background:"red",
            left:0,top:0,right:0,bottom:0,
            overflow:"hidden"
        });
        div1.css({
            display:"inline-block"
        });

        let children = this.dom.children();
        div.append(div1);
        div1.append(children);
        this.dom.append(div);

        this.html = div;
        this.body = div1;
    }

    _createScrollY(){
        let div = $("<div></div>"),
            div1 = $("<div></div>");

        div.append(div1);
        this.dom.append(div);

        this.scrollBarY = div;
        this.scrollerY = div1;

        div.css({
            position:"absolute",
            top:0,
            right:0,
            width:this.scrollBarWidth+"px",
            bottom:0,
            background:this.background,
            display:"none"
        });

        div1.css3({
            position:"absolute",
            left:"20%",
            top:0,
            width:"60%",
            height:"20px",
            background:this.color,
            "border-radius":this.scrollBarWidth+"px",
            "font-size":0,
            "-webkit-text-size-adjust":"none"
        });
    }

    _createScrollX(){
        let div = $("<div></div>"),
            div1 = $("<div></div>");

        div.append(div1);
        this.dom.append(div);

        this.scrollBarX = div;
        this.scrollerX = div1;

        div.css({
            position:"absolute",
            right:0,
            left:0,
            height:this.scrollBarWidth+"px",
            bottom:0,
            background:this.background,
            display:"none"
        });

        div1.css3({
            position:"absolute",
            left:0,
            top:"20%",
            width:"20px",
            height:"60%",
            background:this.color,
            "border-radius":this.scrollBarWidth+"px"
        });
    }

    _refresh(){
        this.htmlWidth = parseInt(this.html.width());
        this.htmlHeight = parseInt(this.html.height());
        this.bodyWidth = parseInt(this.body.width());
        this.bodyHeight = parseInt(this.body.height());

        this._hideScrollBar();

        //判断是否显示滚动条
        if(this.bodyWidth > this.htmlWidth){
            //横向有滚动条
            this.htmlHeight = this.htmlHeight - this.scrollBarWidth;
            this._showScrollBar("x");
            if(this.bodyHeight > this.htmlHeight){
                //纵向有滚动条
                this.htmlWidth = this.htmlWidth - this.scrollBarWidth;
                this._showScrollBar("y");
            }
        }else{
            if(this.bodyHeight > this.htmlHeight){
                //纵向有滚动条
                this.htmlWidth = this.htmlWidth - this.scrollBarWidth;
                this._showScrollBar("y");
                this.bodyWidth = parseInt(this.body.width());
                if(this.bodyWidth > this.htmlWidth){
                    //横向有滚动条
                    this.htmlHeight = this.htmlHeight - this.scrollBarWidth;
                    this._showScrollBar("x");
                }
            }
        }


        //最大滚动距离
        this.maxScrollTop = this.bodyHeight - this.htmlHeight;
        this.maxScrollLeft = this.bodyWidth - this.htmlWidth;

        //滚动条自身长度
        this.scrollXLength = this.htmlWidth*this.htmlWidth/this.bodyWidth;
        this.scrollYLength = this.htmlHeight*this.htmlHeight/this.bodyHeight;
        this.scrollerX.css({width:this.scrollXLength+"px"});
        this.scrollerY.css({height:this.scrollYLength+"px"});
    }

    _showScrollBar(type){
        if(type == "x"){
            this.html.css({"padding-bottom":this.scrollBarWidth+"px"});
            this.scrollBarX.css({display:"block"});
            this.isShowScrollX = true;
        }else{
            this.html.css({"padding-right":this.scrollBarWidth+"px"});
            this.scrollBarY.css({display:"block"});
            this.isShowScrollY = true;
        }
    }

    _hideScrollBar(){
        this.html.css({padding:0});
        this.scrollBarX.css({display:"none"});
        this.scrollBarY.css({display:"none"});
        this.isShowScrollX = false;
        this.isShowScrollY = false;
    }

    _addEventListener(){
        //鼠标滚轮事件
        this.dom.mousewheel((e)=>{
            e.preventDefault();
            let {deltaX,deltaY} = e;
            this.move(-deltaX,deltaY);
        });


        //滚动条点击事件
        this.scrollerX.get(0).addEventListener("mousedown",e=>{
            e.stopPropagation();
            e.preventDefault();
            this._mouseDown("x",e);
        },false);
        this.scrollerY.get(0).addEventListener("mousedown",e=>{
            e.stopPropagation();
            e.preventDefault();
            this._mouseDown("y",e);
        },false);
        document.body.addEventListener("mousemove",e=>{
            this._mouseMove(e);
        },false);
        document.body.addEventListener("mouseup",e=>{
            this._mouseUp();
        },false);
        this.scrollerX.get(0).addEventListener("click",e=>{
            e.stopPropagation();
            e.preventDefault();
        },false);
        this.scrollerY.get(0).addEventListener("click",e=>{
            e.stopPropagation();
            e.preventDefault();
        },false);



        //滚动巢事件
        this.scrollBarX.get(0).addEventListener("click",e=>{
            this._scrollBarClick("x",e);
        },false);
        this.scrollBarY.get(0).addEventListener("click",e=>{
            this._scrollBarClick("y",e);
        },false);

    }

    move(x,y){
        let {abs} = Math;

        if(this.isShowScrollY && y!=0){
            this.scrollTop += y;
            this.scrollTop = DEVICE.getBetweenNumber(this.scrollTop,-this.maxScrollTop,0);
            //移动滚动条
            let top = abs(this.scrollTop)/this.maxScrollTop*(this.htmlHeight-this.scrollYLength);
            this.scrollerY.css3({
                transform:"translateY("+top+"px)"
            })
        }

        if(this.isShowScrollX && x!=0){
            this.scrollLeft += x;
            this.scrollLeft = DEVICE.getBetweenNumber(this.scrollLeft,-this.maxScrollLeft,0);
            //移动滚动条
            let left = abs(this.scrollLeft)/this.maxScrollLeft*(this.htmlWidth-this.scrollXLength);
            this.scrollerX.css3({
                transform:"translateX("+left+"px)"
            });
        }



        //移动dom
        this.body.css3({
            transform:"translateY("+this.scrollTop+"px) translateX("+this.scrollLeft+"px)"
        });


    }

    _mouseDown(type,e){
        if(type == "y"){
            this.hasMouseDownY = true;
            this.startMousePointY = e.clientY;
        }

        if(type == "x"){
            this.hasMouseDownX = true;
            this.startMousePointX = e.clientX;
        }

    }

    _mouseMove(e){
        if(this.hasMouseDownY){
            let y = e.clientY,
                len = y - this.startMousePointY;
            this.startMousePointY = y;
            len = this.maxScrollTop*len/(this.htmlHeight - this.scrollYLength);

            this.move(0,-len);
        }

        if(this.hasMouseDownX){
            let x = e.clientX,
                len = x - this.startMousePointX;
            this.startMousePointX = x;
            len = this.maxScrollLeft*len/(this.htmlWidth - this.scrollXLength);

            this.move(-len,0);
        }
    }

    _mouseUp(){
        this.hasMouseDownX = false;
        this.hasMouseDownY = false;

    }

    _scrollBarClick(type,e){
        let {abs} = Math;

        if(type == "y"){
            let p = e.clientY - this.scrollBarY.offset().top,
                y = abs(this.scrollTop)/this.maxScrollTop*(this.htmlHeight-this.scrollYLength);

            if(p < y){
                //点的滚动条上面的滚动巢
                this.move(0,this.htmlHeight)
            }else{
                //点的滚动条下面的滚动巢
                this.move(0,-this.htmlHeight)
            }

        }

        if(type == "x"){
            let p = e.clientX - this.scrollBarX.offset().left,
                x = abs(this.scrollLeft)/this.maxScrollLeft*(this.htmlWidth-this.scrollXLength);

            if(p < x){
                //点的滚动条上面的滚动巢
                this.move(this.htmlWidth,0);
            }else{
                //点的滚动条下面的滚动巢
                this.move(-this.htmlWidth,0);
            }

        }
    }

    destroy(){

    }



};


var c;
$(document).ready(function(){
    c = new DEVICE.divScrollBar({id:"test1"});

});

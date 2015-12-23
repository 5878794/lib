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


//banner滚动效果，显示3张循环立体效果，微信用，只是不支持手指移动时的时时滑动
//依赖  slide_event.js

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

        this.itemWidth = parseInt(this.lists.width());
        this.itemHeight = parseInt(this.lists.height());
        this.bodyWidth = parseInt(this.body.width());

        var left = (this.bodyWidth - this.itemWidth)/2 + this.itemWidth/ 3,
            right = this.bodyWidth - this.itemWidth*2/3 - (this.bodyWidth - this.itemWidth)/2;
        this.leftCss = {transform:"rotateY(10deg) translate3d("+ -left+"px,0,-50px)"};
        this.rightCss = {transform:"rotateY(-10deg) translate3d("+ right+"px,0,-50px)"};
        this.centerCss = {transform:"rotateY(0deg) translate3d(0,0,30px)"};
        this.startCss = {transform:"rotateY(-20deg) translate3d(0,0,-100px)",display:"block"};
        this.endCss = {transform:"rotateY(20deg) translate3d(0,0,-100px)"};

        this.container = null;          //包裹层
        this.nowPage = 0;
        this.maxPage = this.lists.length - 1;

        this.hideDom = null;
        this.leftDom = null;
        this.centerDom = null;
        this.rightDom = null;

        this.init();

    };
    banner.prototype = {
        init:function(){
            this.createDiv();
            this.setCss();
            this.setListCss();
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
                perspective: "201px",
                "perspective-origin":"50% 50%"
            });
        },
        //设置列表css
        setListCss:function(){
            this.lists.css({
                position:"absolute",
                left:"50%",
                top:"50%",
                "margin-left":-this.itemWidth/2 + "px",
                "margin-top":-this.itemHeight/2 + "px"
            });

            var _this = this;
            this.lists.each(function(i){
                if(i==0){
                    _this.lists.eq(i).css3(_this.centerCss);
                }else if(i==1){
                    _this.lists.eq(i).css3(_this.rightCss);
                }else if(i==_this.lists.length-1){
                    _this.lists.eq(i).css3(_this.leftCss);
                }else{
                    _this.lists.eq(i).css({display:"none"});
                }

            });
        },
        //向左滑动
        moveLeft:function(){
            var left = this.nowPage,
                center = (this.nowPage + 1 > this.maxPage)? 0 : this.nowPage + 1,
                right = (center + 1 > this.maxPage)? 0 : center + 1,
                hidden = (this.nowPage -1 < 0)? this.maxPage : this.nowPage -1;

            this.hideDom = this.lists.eq(hidden);
            this.leftDom = this.lists.eq(left);
            this.centerDom = this.lists.eq(center);
            this.rightDom = this.lists.eq(right).css3(this.startCss);
            this.hideDom.cssAnimate(this.endCss,500,function(){$(this).css({display:"none"})});
            this.leftDom.cssAnimate(this.leftCss,500);
            this.centerDom.cssAnimate(this.centerCss,500);
            this.rightDom.cssAnimate(this.rightCss,500);


            this.nowPage++;
            this.nowPage = (this.nowPage>this.maxPage)? 0 : this.nowPage;
        },
        //向右滑动
        moveRight:function(){
            var center = (this.nowPage -1 < 0)? this.maxPage : this.nowPage - 1,
                right = this.nowPage,
                hidden = (this.nowPage + 1 > this.maxPage)?  0 : this.nowPage + 1,
                left = (center - 1 <0)? this.maxPage : center -1;
            
            this.hideDom = this.lists.eq(hidden);
            this.leftDom = this.lists.eq(left).css3(this.startCss);
            this.centerDom = this.lists.eq(center);
            this.rightDom = this.lists.eq(right);
            this.hideDom.cssAnimate(this.endCss,500,function(){$(this).css({display:"none"})});
            this.leftDom.cssAnimate(this.leftCss,500);
            this.centerDom.cssAnimate(this.centerCss,500);
            this.rightDom.cssAnimate(this.rightCss,500);


            this.nowPage--;
            this.nowPage = (this.nowPage<0)? this.maxPage : this.nowPage;
        },
        addEvent:function(){
            var _this = this;
            $$$(this.body).myslideleft(function(){
                _this.moveLeft();
            });
            $$$(this.body).myslideright(function(){
                _this.moveRight();
            });
        }


    };

    return banner;
})();




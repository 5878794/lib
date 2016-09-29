/**
 * Created by beens on 16/9/29.
 */


//菜单按钮点击变成关闭按钮动画
//opt参数可以省略，只接传后面的function参数

//$.fn.menu_close_btn(opt,function)


//$("#id").menu_close_btn({
//    lineHeight:"1",         //@param:number  default:1      线条的高度
//    lineColor:"#000"        //@param:string  default:#000   线条的颜色
//},function(state){
//    console.log(123);       //按钮点击执行的回调
//})                          //state  @param:bloom
//                            //          true:叉叉状态，已点开
//                            //          false:菜单状态，已关闭



$.fn.menu_close_btn = function(opt,callback){
    if($.isFunction(opt)){
        callback = opt;
        opt = {};
    }else{
        opt = ($.isJson(opt))? opt : {};
        callback = callback || function(){};
    }



    var dom = $(this),
        width = parseInt(dom.width()),
        lineWidth = width/2,
        lineHeight = opt.lineHeight || 1,
        lineColor = opt.lineColor || "#000",
        isShow = false,
        isAnimate = false;



    if(!DEVICE.checkDomHasPosition(dom)){
        dom.css({position:'relative'})
    }

    var line1 = $("<div></div>"),
        line2 = $("<div></div>");

    line1.css({
        position:"absolute",
        left:"25%",
        top:"40%",
        "margin-top":-lineHeight/2+"px",
        "border-top":lineHeight+"px solid "+lineColor,
        width:lineWidth+"px",
        height:0
    });
    line2.css({
        position:"absolute",
        left:"25%",
        top:"60%",
        "margin-top":-lineHeight/2+"px",
        "border-top":lineHeight+"px solid "+lineColor,
        width:lineWidth+"px",
        height:0
    });

    dom.append(line1).append(line2);

    dom.click(function(){
        if(isAnimate){return;}
        isAnimate = true;
        if(!isShow){
            //变叉叉
            line1.classAnimate({
                "0%":"transform:translateY(0) rotateZ(0);",
                "50%":"transform:translateY(0) transform:rotateZ(90deg);",
                "100%":"transform:translateY(10px)  rotateZ(135deg);"
            },500,"cubic-bezier(0, 0, 0.27, 1.3)");
            line2.classAnimate({
                "0%":"transform:translateY(0) rotateZ(0);",
                "100%":"transform:translateY(-10px)  rotateZ(45deg);"
            },500,"cubic-bezier(0, 0, 0.27, 1.3)",false,false,function(){
                isAnimate = false;
                isShow = true;
            });
        }else{
            //还原
            line1.classAnimate({
                "0%":"transform:translateY(10px)  rotateZ(135deg);",
                "50%":"transform:translateY(0) transform:rotateZ(90deg);",
                "100%":"transform:translateY(0) rotateZ(0);"
            },500,"cubic-bezier(0, 0, 0.27, 1.3)");
            line2.classAnimate({
                "0%":"transform:translateY(-10px)  rotateZ(45deg);",
                "100%":"transform:translateY(0) rotateZ(0);"
            },500,"cubic-bezier(0, 0, 0.27, 1.3)",false,false,function(){
                isAnimate = false;
                isShow = false;
            });
        }


        callback(isShow);
    });
};
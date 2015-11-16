/**
 * Created by beens on 15/11/16.
 */



//查看是否联网

//获取当前联网状态
//DEVICE.isOnline.state();  //返回true/false

//事件监听触发
//DEVICE.isOnline.onLineFn = function(){console.log("on")};
//DEVICE.isOnline.offLineFn = function(){console.log("off")};



DEVICE.isOnline = (function(){
    window.addEventListener("online",function(){
        a.onLineFn();
    },false);
    window.addEventListener("offline",function(){
        a.offLineFn();
    },false);

    var a = {
        state:function(){
            return window.navigator.onLine;
        },
        onLineFn:function(){},
        offLineFn:function(){}
    };

    return a;

})();
/**
 * Created by beens on 15/10/29.
 */


//DEVICE.loadImages({
//    res:[                     //要加载的资源图片数组
//       "images/aa.png",
//       "images/bb.png"
//    ],
//    preFn:function(n,total){  //加载完成1个执行   n：加载数  total：总数
//
//    },
//    completeFn:function(){    //加载完成回调
//
//    }
//});



DEVICE.loadImages = function(opt){
    var res = opt.res || [],
        preFn = opt.preFn || function(){},
        completeFn = opt.completeFn || function(){},
        total = res.length,
        n = 0;

    var loaded = function(){
        n++;
        preFn(n,total);
        if(n == total){
            completeFn();
        }
    };

    var load = function(src){
        var img = new Image();
        img.onload = function(){
            loaded();
        };
        img.onerror = function(){
            loaded();
        };

        img.src = src;
    };


    for(var i= 0,l=res.length;i<l;i++){
        var src = res[i];
        load(src);
    }
};
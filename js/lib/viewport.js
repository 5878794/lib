/**
 * Created by beens on 16/3/31.
 */





//viewport设置，高精度效果图用。 可能动画性能降低？
//设置了viewport宽度后，最好用rem单位布局。


//使用时meta需要设置
//<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1, maximum-scale=1">
//psd_width 需要设置psd的实际输出宽度
//psd中的元素布局按实际大小除以100，然后使用rem为单位



(function(){
    var psd_width = 640,
        win_width = window.innerWidth,
        viewport = document.querySelector('meta[name="viewport"]'),
        dpr = window.devicePixelRatio || 1,
        scale = 1 / dpr,
        rem = win_width/psd_width*100;

    viewport.setAttribute('content', 'width=' + dpr * win_width + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');

    var style = document.createElement('style');
    style.innerHTML = "html{font-size:"+rem+"px!important;}";
    document.querySelector("head").appendChild(style);
})();

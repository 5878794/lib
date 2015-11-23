/**
 * Created by beens on 15/11/23.
 */







//浏览器空闲时预加载页面、图片等 (目前chrome，firefox支持，不支持的使用无副作用)

//DEVICE.API.prefetch([
//    "http://www.baidu.com",
//    "http://www.qq.com",
//    "http://www.qq.com/123.jpg"
//]);



if(!DEVICE.API){DEVICE.API={}}
DEVICE.API.prefetch = function(urls){
    urls = urls || [];
    for(var i= 0,l=urls.length;i<l;i++){
        var this_url = urls[i];
        $("body").append("<link rel='prefetch' href='"+this_url+"' />");
    }


};
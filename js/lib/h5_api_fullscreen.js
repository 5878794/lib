/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-9-25
 * Time: 下午9:26
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */



//全屏显示某个元素
//DEVICE.API.fullScreen(dom);
//@param  dom:jqobj     默认document.documentElement及整个页面

//退出全屏
//DEVICE.API.exitFullScreen();


//事件监听
//事件名:DEVICE.FULLSCREEN_EV


//css伪类
//html:-moz-full-screen{};
//html:-webkit-full-screen{};
//html:fullscreen{}




if(!DEVICE.API){DEVICE.API={}}
DEVICE.API.fullScreen = function(dom){
	dom = dom || $(document.documentElement);
	dom = dom.get(0);

	if(dom.requestFullscreen){
		dom.requestFullscreen();
	}else if(dom.webkitRequestFullScreen){
		dom.webkitRequestFullScreen();
	}else if(dom.mozRequestFullScreen){
		dom.mozRequestFullScreen();
	}else if(dom.msRequestFullscreen){
		dom.msRequestFullscreen();
	}
};


DEVICE.API.exitFullScreen = function(){
	if (document.exitFullscreen) {
		document.exitFullscreen();
	}else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	}else if (document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
	}else if (document.msexitFullscreen) {
		document.msexitFullscreen();
	}
};



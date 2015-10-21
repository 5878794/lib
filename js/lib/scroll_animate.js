/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-8-13
 * Time: 上午10:37
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */


//滚动条使用动画滚动,屏蔽系统默认滚动  (需要jquery.mousewheel插件)
//DEVICE.scrollAnimate(time,len);
// @param   time:number def:1000
// @param   len :number def:300
(function(){
	//阻止默认滚动事件,使用模拟的滚动
	var device = DEVICE,
		nextFrame = device.nextFrame,
		cancelFrame = device.cancelFrame,
		animateFn = null,               //滚动动画函数
		time = 1000,        //滚动的时间
		len = 300;          //滚动的距离


	var addEvent = function(){
		$(document).mousewheel(function(e,delta){
			e.preventDefault();
			var scroll_top = $(document).scrollTop(),
				max_scroll_top = parseInt($("body").height()) - window.innerHeight;


			if(delta>0){
				//向上
				cancelFrame(animateFn);
				scrollAnimate(1,scroll_top,max_scroll_top);
			}else{
				//向下
				cancelFrame(animateFn);
				scrollAnimate(-1,scroll_top,max_scroll_top);
			}
		});
	};

	//模拟的滚动效果
	var scrollAnimate = function(type,scroll_top,max_scroll_top){
		var startTime = new Date().getTime();

		var animate = function () {
			var now = Date.now();
			var len1 = (type>0)? -len : len;

			if (now >= startTime + time) {
				var now_scroll_top = scroll_top+len1;
				$(document).scrollTop(now_scroll_top);
				//imageScroll(now_scroll_top);
				animateFn = null;
				return;
			}

			now = (now - startTime) / time - 1;
			var easeOut = Math.sqrt(1 - now * now);
			var newY = (scroll_top+len1 - scroll_top) * easeOut + scroll_top;

			newY = (newY >= max_scroll_top)? max_scroll_top : newY;
			newY = (newY <= 0)? 0 : newY;

			$(document).scrollTop(newY);
			//imageScroll(newY);
			animateFn = nextFrame(animate);
		};

		animate();
	};


	DEVICE.scrollAnimate = function(_time,_len){
		time = _time || 1000;
		len = _len || 300;
		addEvent();
	};
})();
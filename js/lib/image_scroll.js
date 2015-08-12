/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-8-10
 * Time: 下午1:38
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */






//图片跟随浏览器滚动而滚动
//会屏蔽浏览器自身的滚动改为模拟滚动
//DEVICE.imageSlideByScroll({
//  obj:$(".image_area").eq(0),             //jqobj
//  imgSrc:"http://www.baidu.com/aa.jpg",       //图片src地址
//	progress:function(pre){                   //背景图片滚动到的百分比  pre=0.1/0.5....
//	    console.log(pre)
//  }
//})
(function(){
	var device = DEVICE,
		nextFrame = device.nextFrame,
		cancelFrame = device.cancelFrame,
		animateFn = null,               //滚动动画函数
		addEventListener = false,       //是否已监听鼠标滚轮事件
		time = 1000,        //滚动的时间
		len = 300,          //滚动的距离
		images = [];        //要滚动的图片对象

	//阻止默认滚动事件,使用模拟的滚动
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


		$(window).scroll(function(){
			var scroll_top = $(document).scrollTop();
			imageScroll(scroll_top);
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

	//图片滚动
	var imageScroll = function(scroll_top){
		var win_height = window.innerHeight,
			page_scroll_top = scroll_top + win_height;

		for(var i= 0,l=images.length;i<l;i++){
			var this_image = images[i],
				img_can_show_top = (this_image.top - win_height > 0)? this_image.top - win_height : 0;

			if(page_scroll_top >= img_can_show_top && scroll_top <= this_image.bottom){
				var scroll_can_move_len = this_image.bottom - img_can_show_top,
					img_can_move_len = this_image.img_height - this_image.div_height,
					move_len = scroll_top - img_can_show_top,
					pre = move_len / scroll_can_move_len;

				pre = (pre<0)? 0 : pre;
				var _height = img_can_move_len * pre;

				this_image.obj.css({
					"background-position":"center -"+ _height+"px"
				});
				this_image.callback(pre);
			}


		}

	};


	DEVICE.imageSlideByScroll = function(param){
		if(!addEventListener){
			addEventListener = true;
			addEvent();
		}


		var obj = param.obj,
			this_height = parseInt(obj.height()),
			this_top = obj.offset().top,
			img_src = param.imgSrc,
			img = new Image(),
			fn = param.progress;



		img.onload = function(){
			images.push({
				obj:obj,
				top:this_top,
				div_height:this_height,
				img_height:this.height,
				bottom:this_top+this_height,
				callback:fn
			});

			obj.css({
				"background-image": "url('"+img_src+"')",
				"background-repeat": "no-repeat",
				"background-position": "center top"
			});

			imageScroll($(document).scrollTop());
		};

		img.src = img_src;

	};
})();







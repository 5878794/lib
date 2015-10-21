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



//图片跟随滚动条滚动
//DEVICE.imageSlideByScroll({
//  obj:$(".image_area").eq(0),             //jqobj
//  imgSrc:"http://www.baidu.com/aa.jpg",       //图片src地址
//	progress:function(pre){                   //背景图片滚动到的百分比  pre=0.1/0.5....
//	    console.log(pre)
//  }
//})
(function(){
	var addEventListener = false,
		images = [];

	var addEvent = function(){
		$(window).scroll(function(){
			var scroll_top = $(document).scrollTop();
			imageScroll(scroll_top);
		});
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
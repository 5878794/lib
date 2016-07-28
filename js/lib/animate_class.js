/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-8-6
 * Time: 上午10:12
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */



//css3 class动画
//$.fn.classAnimate(params)
//@param obj     {"0%":"transform:scale(1);background:#000;","100%":"transform:scale(2);background:#fff;"}
//@param time    时间毫秒:2000
//@param type    动画方式:linear
//@param infinite  动画是否循环: true/false
//@param alternate 动画是否反向:  true/false
//@param callback  动画完成回调:fn    循环时无效
//@param willChange  硬件加速   	transform			变形
// 							   	scroll-position		滚动
// 								contents			内容变化
//								opacity				透明度
//								left, top			定位

//停止循环的动画
//$.fn.removeClassAnimate();


$.fn.classAnimate = (function(){
	var fns = {},
		clearFn = function(obj,_id){
			obj.get(0).removeEventListener(DEVICE.ANIEND_EV,fns[_id],false);
			obj.removeClassAnimate();
			delete fns[_id];
		},
		addFn = function(id,obj,callback){
			var _id = "__temp_"+DEVICE.counter()+"__";
			obj.get(0).addEventListener(DEVICE.ANIEND_EV,fns[_id] = function(e){
				if(id == e.animationName){
					callback.call(this);
					clearFn(obj,_id);
				}
			},false);
		};

	return function(obj,time,type,infinite,alternate,callback,willChange){
		var id = "__keyframes_"+DEVICE.counter()+"__";
		time = parseInt(time) || 1000;
		type = type || "linear";
		infinite = $.getBloom(infinite);
		//callback = $.getFunction(callback);
		alternate = $.getBloom(alternate);
		willChange = willChange || "auto";

		time = time+"ms";
		infinite = (infinite)? "infinite" :"";
		alternate = (alternate)? "alternate" : "";
		var class_name = id+"class__";

		if(!$.isObject(obj)){
			throw("css3Animate 参数样式结构错误");
		}



		//生成style
		var last_style = "";
		var style = $("<style id='"+class_name+"'></style>");

		var css = " animation: " + id + " " + time + " " + type + " " + infinite + " " + alternate +";";
		//css += "will_change:all;";
		css = $.css3(css);
		css = "."+class_name+"{"+css+"} @keyframes "+id+"{";

		for(var key in obj){
			if(obj.hasOwnProperty(key)){
				var this_val = $.css3(obj[key]);
				css += key + " {" + this_val + "}";
				last_style = this_val;
			}
		}

		css +=  "}";


		style.text(css);
		$("head").append(style);



		//生成最终的css
		var last_css = {};
		last_style = last_style.split(";");
		for(var z=0,zl=last_style.length;z<zl;z++){
			var this_style = last_style[z].split(":");
			if(this_style.length == 2){
				var _key = $.trim(this_style[0]),
					_val = $.trim(this_style[1]);
				last_css[_key] = _val;
			}
		}




		$(this).each(function(){
			if($(this).css("display") == "none" || $(this).css("visibility") == "hidden"){

			}else{
				$(this).css({"will-change":willChange});
				$(this).addClass(class_name);
				$(this).css(last_css);
				$(this).get(0).__animate_css3_class__ = class_name;
			}
		});


		if(!$.isFunction(callback)){return $(this);}
		if(infinite){return $(this);}


		$(this).each(function(){
			if($(this).css("display") == "none" || $(this).css("visibility") == "hidden"){

			}else{
				addFn(id,$(this),callback);
			}
		});

		return $(this);
	}
})();



$.fn.removeClassAnimate = function(){
	var temp = {};


	$(this).each(function(){
		var class_name = $(this).get(0).__animate_css3_class__;
		temp[class_name] = true;
		$(this).removeClass(class_name);
		$(this).css({"will-change":"auto"});
	});

	for(var key in temp){
		if(temp.hasOwnProperty(key)){
			var style = $("#"+key);
			if(style.length != 0){
				style.remove();
			}
		}
	}
};
/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-8-6
 * Time: 上午10:11
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */



//css动画
$.fn.cssAnimate=(function(){

	var cssanimagefn = {},
		counter = (function(){
			var a = 0;
			return function(){
				a += 1;
				return a;
			}
		})(),
		device = DEVICE,
		clearfn = function(obj,keyname){
			obj.removeEventListener(device.TRNEND_EV,cssanimagefn[keyname],false);
			delete cssanimagefn[keyname];
			delete obj.__bens_cssfn_id__;
		};

	return function(data,time,callback,is_3d,type){
		var _this=$(this),
			_that = _this.get(0),
			_thatstyle = _that.style;

		type = type || "ease";
		data = JSON.parse(DEVICE.fixObjCss(JSON.stringify(data)));
		time = time || 1000;
		callback = $.getFunction(callback);
		is_3d = ($.isBoolean(is_3d))?  is_3d : false;

		if(_that.__bens_cssfn_id__){
			var temp_key = _that.__bens_cssfn_id__;
			clearfn(_that,temp_key);
		}

		var thiskey = counter();
		_that.__bens_cssfn_id__ = thiskey;


		cssanimagefn[thiskey]=function(e){
			var p_name = e.propertyName;
			if(e.target == _that && data.hasOwnProperty(p_name)){

				//_this.get(0).style["webkitTransition"]="all 0 ease";
				_thatstyle[device._transitionProperty] = "";
				_thatstyle[device._transitionDuration] = "";
				_thatstyle[device._transitionTimingFunction] = "";
				_thatstyle["webkitTransformStyle"]="";
				_thatstyle["webkitBackfaceVisibility"]="";
				_thatstyle.willChange = "auto";

				callback();
				clearfn(_that,thiskey);
			}
		};

		_thatstyle[device._transitionProperty] = "all";
		_thatstyle[device._transitionDuration] = time+"ms";
		_thatstyle[device._transitionTimingFunction] = type;
		_thatstyle.willChange = "all";

		_thatstyle["webkitTransformStyle"]="preserve-3d";   //webkit私有
		if(!is_3d){
			_thatstyle["webkitBackfaceVisibility"]="hidden";    //webkit私有
		}else{
			_thatstyle["webkitBackfaceVisibility"]="visible";    //webkit私有
		}


		setTimeout(function(){
			_that.addEventListener(device.TRNEND_EV,cssanimagefn[thiskey],false);
			_this.css(data);
		},1);

	}
})();
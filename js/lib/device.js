/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-8-5
 * Time: 上午11:49
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */



var DEVICE = {};



//*****************************************************
//获取浏览器或设备名称  以及版本号
//*****************************************************
//输出结果:
//---------------------------------------------------------
//DEVICE.isIpad             @param:bloom    是否是：ipad
//DEVICE.isIphone           @param:bloom    是否是：ipbone
//DEVICE.isAndroid          @param:bloom    是否是：android
//DEVICE.isIe               @param:bloom    是否是：ie
//DEVICE.isFirefox          @param:bloom    是否是：firefox
//DEVICE.isChrome           @param:bloom    是否是：chrome
//DEVICE.isOpera            @param:bloom    是否是：opera
//DEVICE.isSafari           @param:bloom    是否是：safari

//DEVICE.ver                @param:number   浏览器版本或  ipad/iphone/android系统版本
//---------------------------------------------------------
(function () {
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	var s;
	(s = ua.match(/ipad; cpu os ([\d_]+)/)) ? Sys.ipad = s[1].replace(/_/g, ".") :
		(s = ua.match(/iphone os ([\d_]+)/)) ? Sys.iphone = s[1].replace(/_/g, ".") :
			(s = ua.match(/android[ \/]([\d.]+)/)) ? Sys.android = s[1] :
				(s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
					(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
						(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
							(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
								(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
									(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : Sys._ = 0;


	DEVICE.isIpad = (Sys.hasOwnProperty("ipad"));
	DEVICE.isIphone = (Sys.hasOwnProperty("iphone"));
	DEVICE.isAndroid = (Sys.hasOwnProperty("android"));
	DEVICE.isIe = (Sys.hasOwnProperty("ie"));
	DEVICE.isFirefox = (Sys.hasOwnProperty("firefox"));
	DEVICE.isChrome = (Sys.hasOwnProperty("chrome"));
	DEVICE.isOpera = (Sys.hasOwnProperty("opera"));
	DEVICE.isSafari = (Sys.hasOwnProperty("safari"));


	DEVICE.ver = 0;
	var ver;
	for (var key in Sys) {
		if (Sys.hasOwnProperty(key)) {
			ver = Sys[key];
		}
	}
	ver = ver.split(".");
	var _ver = [];
	for (var i = 0, l = ver.length; i < l; i++) {
		if (i >= 2) {
			break;
		}
		_ver.push(ver[i]);
	}
	_ver = _ver.join(".");
	DEVICE.ver = _ver;

	DEVICE.isPhone = (DEVICE.isAndroid || DEVICE.isIpad || DEVICE.isIphone);
})();




//*****************************************************
//处理浏览器css前缀问题 以及其它一些属性
//*****************************************************
//输出结果：
//属性：------------------------------------------------
//DEVICE.has3d              @param:bloom    是否支持3d
//DEVICE.hasTouch           @param:bloom    是否是触摸屏
//DEVICE.hasTransform       @param:bloom    是否支持变形
//DEVICE.language           @param:str      语言版本  zh-cn

//事件：------------------------------------------------
//DEVICE.RESIZE_EV          @param:str      窗口变化
//DEVICE.START_EV           @param:str      点击
//DEVICE.MOVE_EV            @param:str      移动
//DEVICE.END_EV             @param:str      释放
//DEVICE.CANCEL_EV          @param:str      点击结束
//DEVICE.TRNEND_EV          @param:str      变形结束 ｅｇ:webkitTransitionEnd

//函数：------------------------------------------------
//DEVICE.nextFrame          fn              执行动画函数　１秒６０帧
//DEVICE.cancelFrame        fn              停止动画
//DEVICE.counter            fn              计数器 返回页面全局唯一ｉｄ数字，从１开始。
//DEVICE.fixObjCss          fn              ｊｑ调用，免ｃｓｓ前缀（部分）
//DEVICE.fixCss             fn              免ｃｓｓ前缀（部分）
//-----------------------------------------------------
(function () {
	var dummyStyle = document.createElement("div").style,
		vendor = (function () {
			if (window.navigator.msPointerEnabled) {
				return "";
			}
			if ("MozTransform" in dummyStyle) {
				return "";
			}
			var vendors = 'webkitT,MozT,msT,OT,t'.split(','),
				t,
				i = 0,
				l = vendors.length;

			for (; i < l; i++) {
				t = vendors[i] + 'ransform';
				if (t in dummyStyle) {
					return vendors[i].substr(0, vendors[i].length - 1);
				}
			}

			return false;
		})(),
		prefixStyle = function (style) {
			if (!vendor) return style;

			style = style.charAt(0).toUpperCase() + style.substr(1);
			return vendor + style;
		},
		has3d = prefixStyle('perspective') in dummyStyle,


		windowTouch = (window.navigator.msMaxTouchPoints && window.navigator.msMaxTouchPoints > 0) ? true : false,
		webkitTouch = 'ontouchstart' in window,
		hasTouch = (webkitTouch || windowTouch),
		hasTransform = vendor !== false,

		_transform = prefixStyle('transform'),
		_transitionProperty = prefixStyle('transitionProperty'),
		_transitionDuration = prefixStyle('transitionDuration'),
		_transformOrigin = prefixStyle('transformOrigin'),
		_transitionTimingFunction = prefixStyle('transitionTimingFunction'),
		_transitionDelay = prefixStyle('transitionDelay'),

		FULLSCREEN_EV = (function(){
			if (vendor === false) return "fullscreenchange";

			var fullscreenchange = {
				'': 'fullscreenchange',
				'webkit': 'webkitfullscreenchange',
				'Moz': 'mozfullscreenchange',
				'O': 'ofullscreenchange',
				'ms': 'msfullscreenchange'
			};

			return fullscreenchange[vendor];
		})(),
		RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
		START_EV = webkitTouch ? 'touchstart' : windowTouch ? 'MSPointerDown' : 'mousedown',
		MOVE_EV = webkitTouch ? 'touchmove' : windowTouch ? 'MSPointerMove' : 'mousemove',
		END_EV = webkitTouch ? 'touchend' : windowTouch ? 'MSPointerUp' : 'mouseup',
		CANCEL_EV = webkitTouch ? 'touchcancel' : windowTouch ? 'MSPointerUp' : 'mouseup',
		TRNEND_EV = (function () {
			if (vendor === false) return "transitionend";

			var transitionEnd = {
				'': 'transitionend',
				'webkit': 'webkitTransitionEnd',
				'Moz': 'transitionend',
				'O': 'otransitionend',
				'ms': 'MSTransitionEnd'
			};

			return transitionEnd[vendor];
		})(),
		ANIEND_EV = (function(){
			if (vendor === false) return "animationEnd";

			var transitionEnd = {
				'': 'animationEnd',
				'webkit': 'webkitAnimationEnd',
				'Moz': 'mozAnimationEnd',
				'O': 'oanimationend',
				'ms': 'MSAnimationEnd'
			};

			return transitionEnd[vendor];
		})(),
		nextFrame = (function () {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback) {
					return setTimeout(callback, 1);
				};
		})(),
		cancelFrame = (function () {
			return window.cancelAnimationFrame ||
				window.webkitCancelAnimationFrame ||
				window.webkitCancelRequestAnimationFrame ||
				window.mozCancelRequestAnimationFrame ||
				window.oCancelRequestAnimationFrame ||
				window.msCancelRequestAnimationFrame ||
				clearTimeout;
		})(),
		checkDomHasPosition = function(dom){
			var position = dom.css("positon");
			return (
				position == "fixed" ||
				position == "absolute" ||
				position == "relative"
			)
		},
		counter = (function () {
			var a = 0;
			return function () {
				a += 1;
				return a;
			}
		})(),
		language = (navigator.browserLanguage || navigator.language).toLowerCase(),


		t_v = (function () {
			var _vendors = 'webkitT,MozT,msT,OT'.split(','),
				t,
				i = 0,
				l = _vendors.length;

			for (; i < l; i++) {
				t = _vendors[i] + 'ransform';
				if (t in dummyStyle) {
					return ("-" + _vendors[i].substr(0, _vendors[i].length - 1) + "-");
				}
			}
			return "";
		})(),
		getCssName = function (style) {
			return (style in dummyStyle) ? style :
				   (t_v + style in dummyStyle) ? t_v + style : style;
		},
	//判断盒子模型的版本 2009版 2011版  2013版
		boxVendors = "",
		boxType = (function () {
			if ("boxPack" in dummyStyle) {
				return 2009;
			}
			if (t_v + "box-pack" in dummyStyle) {
				boxVendors = t_v;
				return 2009;
			}


			if ("flexPack" in dummyStyle) {
				return 2011;
			}
			if (t_v + "flex-pack" in dummyStyle) {
				boxVendors = t_v;
				return 2011;
			}


			if ("flexBasis" in dummyStyle) {
				return 2013;
			}
			if (t_v + "flex-basis" in dummyStyle) {
				boxVendors = t_v;
				return 2013;
			}
		})(),

	//（值）定义盒子模型 display:flex
		box = (boxType == 2013) ? boxVendors + "flex" :
			(boxType == 2011) ? boxVendors + "flexbox" :
				(boxType == 2009) ? boxVendors + "box" : "flex",
	//与盒子内布局方向相同，  start  end 。。。
		align_items = (boxType == 2013) ? boxVendors + "align-items" :
			(boxType == 2011) ? boxVendors + "flex-pack" :
				(boxType == 2009) ? boxVendors + "box-pack" : "align-items",
	//与盒子内布局方向相反，  start  end 。。。
		justify_content = (boxType == 2013) ? boxVendors + "justify-content" :
			(boxType == 2011) ? boxVendors + "flex-align" :
				(boxType == 2009) ? boxVendors + "box-align" : "justify-content",

	//盒子子元素所占比例
		flex = (boxType == 2013) ? boxVendors + "flex" :
			(boxType == 2011) ? boxVendors + "flex" :
				(boxType == 2009) ? boxVendors + "box-flex" : "flex",

	//盒子方向
		flex_direction = (boxType == 2013) ? boxVendors + "flex-direction" :
			(boxType == 2011) ? boxVendors + "flex-direction" :
				(boxType == 2009) ? boxVendors + "box-orient" : "flex-direction",

	//（值）横向排列
		flex_direction_row = (boxType == 2013) ? "row" :
			(boxType == 2011) ? "row" :
				(boxType == 2009) ? "horizontal" : "row",

	//（值）纵向排列
		flex_direction_column = (boxType == 2013) ? "column" :
			(boxType == 2011) ? "column" :
				(boxType == 2009) ? "vertical" : "column",


		animation = getCssName("animation"),
		box_shadow = getCssName("box-shadow"),
		backgroundSize = getCssName("background-size"),
		transform = getCssName("transform"),
		transformOrigin = getCssName("transform-origin"),
		border_radius = getCssName("border-radius"),
		box_sizing = getCssName("box-sizing"),
		background_clip = getCssName("background-clip"),
		border_bottom_left_radius = getCssName("border-bottom-left-radius"),
		border_bottom_right_radius = getCssName("border-bottom-right-radius"),
		border_top_left_radius = getCssName("border-top-left-radius"),
		border_top_right_radius = getCssName("border-top-right-radius"),
		backface_visibility = getCssName("backface-visibility"),
		transition = getCssName("transition"),
		transition_property = getCssName("transition-property"),
		transition_duration = getCssName("transition-duration"),
		transition_timing_function = getCssName("transition-timing-function");


	var css = {
			"box": box,
			"justify-content": justify_content,
			"align-items": align_items,
			"background-size": backgroundSize,
			"background-clip": background_clip,
			"flex": flex,
			"flex-direction": flex_direction,
			"row": flex_direction_row,
			"column": flex_direction_column,
			"transform": transform,
			"transform-origin":transformOrigin,
			"border-radius": border_radius,
			"border-bottom-left-radius": border_bottom_left_radius,
			"border-bottom-right-radius": border_bottom_right_radius,
			"border-top-left-radius": border_top_left_radius,
			"border-top-right-radius": border_top_right_radius,
			"box-sizing": box_sizing,
			"box-shadow": box_shadow,
			"backface-visibility": backface_visibility,
			"transition": transition,
			"transition-property": transition_property,
			"transition-duration": transition_duration,
			"transition-timing-function": transition_timing_function,
			"animation":animation
		},
		gz = (function () {
			var reg, a = [];
			for (var key in css) {
				if (css.hasOwnProperty(key)) {
					if (key == "box" || key == "transition" || key == "flex") {
						a.push("([^-]" + key + "[^-])");
					} else if (key == "row" || key == "column") {
						a.push(key);
					} else {
						a.push("([^-]" + key + ")");
					}
				}
			}
			reg = a.join("|");
			return new RegExp(reg, "ig");
		})(),
		css_prefix = function (data) {
			var text = JSON.stringify(data),
				newtext = cssfile_prefix(text);
			return JSON.parse(newtext);
		},
		cssfile_prefix = function (data) {
			return  data.replace(gz, function (a) {
				var str = a.substr(1, a.length - 2);
				if (str == "box" || str == "transition" || str == "flex") {
					var newstr = css[str];
					return a.substr(0, 1) + newstr + a.substr(a.length - 1);
				} else if (a == "row" || a == "column") {
					return css[a];
				} else {
					return a.substr(0, 1) + css[a.substr(1)];
				}
			});
		},
		fix_css = function (css) {
			css = css.replace(/;/ig, " ; ");
			return cssfile_prefix(" "+css);
		};

	dummyStyle = null;


	DEVICE.has3d = has3d;         //是否支持3d
	DEVICE.hasTouch = hasTouch;  //是否是触摸屏
	DEVICE.hasTransform = hasTransform;  //是否支持变形


	DEVICE._transform = transform;        //自动添加前缀
	DEVICE._transitionProperty = _transitionProperty;
	DEVICE._transitionDuration = _transitionDuration;
	DEVICE._transformOrigin = _transformOrigin;
	DEVICE._transitionTimingFunction = _transitionTimingFunction;
	DEVICE._transitionDelay = _transitionDelay;


	DEVICE.RESIZE_EV = RESIZE_EV;    //窗口变化
	DEVICE.START_EV = START_EV;  //点击
	DEVICE.MOVE_EV = MOVE_EV;   //移动
	DEVICE.END_EV = END_EV;     //释放
	DEVICE.CANCEL_EV = CANCEL_EV;      //结束
	DEVICE.TRNEND_EV = TRNEND_EV;       //变形结束 webkitTransitionEnd
	DEVICE.ANIEND_EV = ANIEND_EV;       //webkitAnimationEnd
	DEVICE.FULLSCREEN_EV = FULLSCREEN_EV;  //全屏事件监听


	DEVICE.nextFrame = nextFrame;
	DEVICE.cancelFrame = cancelFrame;

	DEVICE.language = language;   //语言版本  zh-cn
	DEVICE.counter = counter;        //计数器  fn

	DEVICE.fixObjCss = css_prefix;
	DEVICE.fixCss = fix_css;


	DEVICE.css = css;
	DEVICE.boxType = boxType;
	DEVICE.boxVendors = boxVendors;

	DEVICE.checkDomHasPosition = checkDomHasPosition;
})();
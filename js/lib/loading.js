/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-9-7
 * Time: 上午4:26
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */




//loading动画   具体参数见函数
//var a = new DEVICE.loading();
//a.show("loading");
//a.hide();
//a.destroy();




DEVICE.loading  = (function(){
	var __loading = function(datas){
		this.obj = (datas.obj.length == 1)? datas.obj.get(0) : datas.obj;    //要放入的对象
		this.spokes = ($.isNumber(datas.number))? datas.number : 7;     //花瓣的次数
		this.width = ($.isNumber(datas.width))? datas.width : 30;       //loading所占的宽度
		this.height = ($.isNumber(datas.height))? datas.height : 30;    //loading所占的高度
		this.lineWidth = ($.isNumber(datas.lineWidth))? datas.lineWidth : 5;  //loading线条的宽度
		this.lineHeight = ($.isNumber(datas.lineHeight))? datas.lineHeight : 2; //loading线条的长度
		this.rgb = datas.rgb || "0,0,0";
		this.spd = datas.fps || 100;


		this.canvas = null;
		this.ctx = null;
		this.intervalFn = null;

		this.init();
	};
	__loading.prototype = {
		init:function(){
			this.createCanvas();
		},
		//创建画板
		createCanvas:function(){
			var _this = this;
			this.canvas = document.createElement("canvas");
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			if (!this.canvas.getContext){console.log("not suppot canvas");return;}
			this.ctx = this.canvas.getContext('2d');
			this.ctx.translate(_this.width/2,_this.width/2);	// Center the origin
			this.ctx.lineWidth = this.lineWidth;
			this.ctx.lineCap = "round";

			this.appendCanvas();
		},
		//添加画板
		appendCanvas:function(){
			this.obj.appendChild(this.canvas);
		},
		//画画
		draw:function(){
			var ctx = this.ctx,
				spokes = this.spokes,
				_this = this;

			ctx.clearRect(-_this.width/2,-_this.height/2,_this.width,_this.height);		// Clear the image
			ctx.rotate(Math.PI*2/spokes);	// Rotate the origin
			for (var i=0; i<spokes; i++) {
				ctx.rotate(Math.PI*2/spokes);	// Rotate the origin
				ctx.strokeStyle = "rgba("+this.rgb+","+ i/spokes +")";	// Set transparency
				ctx.beginPath();
				ctx.moveTo(0,_this.width/3 - _this.lineHeight);
				ctx.lineTo(0,_this.width/3);
				ctx.stroke();
			}
		},
		//开始转
		run:function(){
			var _this = this;
			this.intervalFn = setInterval(function(){
				_this.draw();
			},this.spd);
		},
		//停止
		stop:function(){
			var _this = this;
			clearInterval(this.intervalFn);
			this.ctx.clearRect(-_this.width/2,-_this.height/2,_this.width,_this.height);
		},
		//销毁
		destroy:function(){
			this.stop();
			$(this.canvas).remove();
		}
	};

	var device = DEVICE;

	var a = function(obj,scale){
		obj = obj || $("body");
		this.win = $.getDom(obj);

		if(!this.win){console.log("loading param error");return;}

		//this.win 转原生对象

		this.text = null;       //显示文字的对象
		this.canvas = null;     //动画canvas对象
		this.div = null;        //主窗口

		this.downfn = null;     //阻止事件冒泡和默认事件
		this.movefn = null;
		this.endfn = null;
		this.scale = scale*3 || 1;

		this._init();
	};
	a.prototype = {
		_init:function(){
			this.win.style.position = "relative";
			this._createObj();
			this._addEven();
		},
		//创建对象
		_createObj:function(){
			var win = document.createElement("div"),
				main = document.createElement("div"),
				_canvas =document.createElement("div"),
				text = document.createElement("div");

			$(win).css(device.fixObjCss({
				position:"fixed",
				"z-index":"99999",
				left:0,
				top:0,
				width:"100%",
				height:"100%",
				display:"none",
				"justify-content":"center",
				"align-items":"center"
			}));
			$(main).css(device.fixObjCss({
				padding:20 * this.scale + "px",
				background:"rgba(0,0,0,0.8)",
				"border-radius":5 * this.scale + "pt",
				display:"box",
				"flex-direction":"column",
				"justify-content":"center"

			}));


			_canvas.style.cssText = "width:"+60*this.scale+"px;height:"+60*this.scale+"px;";
			text.style.cssText = "height:"+30*this.scale+"px;line-height:"+30*this.scale+"px;color:#ccc;font-size:"+12*this.scale+"px;text-align:center;";


			var canvas = new __loading({
				obj:_canvas,
				width:60 * this.scale,
				height:60 * this.scale,
				rgb:"230,230,230",
				lineWidth:5 * this.scale,
				lineHeight:3 * this.scale,
				number:9,
				fps:100
			});


			$(main).append(_canvas).append(text);
			$(win).append(main);

			$(this.win).append(win);

			this.text = text;
			this.canvas = canvas;
			this.div = win;
		},
		//阻止事件冒泡
		_addEven:function(){
			var _box = this.div,
				_this = this;
			_box.addEventListener(device.START_EV,_this.downfn = function(e){e.stopPropagation();e.preventDefault();},false);
			_box.addEventListener(device.MOVE_EV,_this.movefn = function(e){e.stopPropagation();e.preventDefault();},false);
			_box.addEventListener(device.END_EV,_this.endfn = function(e){e.stopPropagation();e.preventDefault();},false);
		},
		//显示
		show:function(text){
			$(this.text).text(text);
			$(this.div).css(device.fixObjCss({
				display:"box"
			}));
			this.canvas.run();
		},
		changeText:function(text){
			$(this.text).text(text);
		},
		//隐藏
		hide:function(){
			this.div.style.display = "none";
			this.canvas.stop();
		},
		//销毁
		destroy:function(){
			this.canvas.destroy();
			this.canvas = null;
			var _this = this;
			this.div.removeEventListener(device.START_EV,_this.downfn,false);
			this.div.removeEventListener(device.MOVE_EV,_this.movefn,false);
			this.div.removeEventListener(device.END_EV,_this.endfn,false);
			$(this.div).remove();
		}
	};


	return a;
})();
/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-8-6
 * Time: 上午11:44
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */




/**
 *
 * 滑动事件  $$$
 * bens jq.mobi jq.extend device
 *
 * 返回对象
 * var a=require("slideevent");
 *
 *
 * 以下 obj为dom对象  jq或原生对象   注意：只能绑定单个对象，不能一次绑定多个对象
 * e为点击开始时的事件,滑动中为时时事件
 * 上下左右滑动触发时间为500毫秒内，从点击开始时计算，500参数可以调整
 * 函数可以连写。
 *
 *  obj = id/obj/jqobj  单个对象
 *
 * @fn a(obj).myslidedown(function(e){})            向下滑动
 * @fn a(obj).myslideup(fn)                         向上滑动
 * @fn a(obj).myslideleft(fn)                       向左滑动
 * @fn a(obj).myslideright(fn)                      向右滑动
 * @fn a(obj).mystart(fn)                           按下执行
 * @fn a(obj).mymoving(fn)                          滑动中触发，释放结束，不受500ms的限制
 * @fn a(obj).myend(fn)                             释放事件，如触发滑动则不会触发该事件
 * @fn a(obj).unbind(str)          str = myslidedown/myslideup/myslideleft/myslideright/mymoving/myend
 *                                       true:全部
 */
(function(){
	var device = DEVICE;

	var createMySlideEven=function(datas){
		var obj = datas.obj;

		this.events = datas.saveAddress;


		if(!$.isObject(obj)){console.log("滑动参数错误");return;}
		if(obj.length > 0){
			obj = obj.get(0);
		}

		this.obj=obj;

		this.slideEventJG = 500;    //释放后300秒触发一次
		this.eventobj = null;
		this.startTime=null;
		this.allowTrigerTime = 500;   //500秒内释放有效
		this.moveStartTime = 0;
		this.movefnTrigerTime = 10;     //移动事件回调10毫秒触发一次
		this.points=[];

		//this.leftSlideEven=null;
		//this.rightSlideEven=null;
		//this.upSlideEven=null;
		//this.downSlideEven=null;

		this.touchStart=null;
		this.touchMove=null;
		this.touchEnd=null;

		this.minLength=10;
		this.hasTouch=device.hasTouch;
		this.state=false;

		this.eventBind();
	};
	createMySlideEven.prototype={
		eventBind:function(){
			var _this=this;
			this.obj.addEventListener(device.START_EV,this.touchStart=function(e){_this.touchStartHandler(e);},false);
			this.obj.addEventListener(device.MOVE_EV,this.touchMove=function(e){_this.touchMoveHandler(e);},false);
			this.obj.addEventListener(device.END_EV,this.touchEnd=function(e){_this.touchEndHandler(e);},false);

			//this.leftSlideEven=document.createEvent('Event');
			//this.leftSlideEven.initEvent("myslideleft", true, true);

			//this.rightSlideEven=document.createEvent('Event');
			//this.rightSlideEven.initEvent("myslideright", true, true);

			//this.upSlideEven=document.createEvent('Event');
			//this.upSlideEven.initEvent("myslideup", true, true);

			//this.downSlideEven=document.createEvent('Event');
			//this.downSlideEven.initEvent("myslidedown", true, true);
		},
		removeEven:function(){
			this.obj.removeEventListener(device.START_EV,this.touchStart,false);
			this.obj.removeEventListener(device.MOVE_EV,this.touchMove,false);
			this.obj.removeEventListener(device.END_EV,this.touchEnd,false);
		},
		f5:function(){
			this.points=[];
		},
		touchStartHandler:function(e){
			var starttime = new Date().getTime(),
				savetime = this.startTime || 0;
			if(starttime - savetime < this.slideEventJG){
				this.startTime = starttime;
				this.state=false;
				return;
			}
			this.f5();			//刷新参数
			this.savePoint(e);	//记录当前点
			this.state=true;
			this.startTime = new Date().getTime();
			this.eventobj = e;
			if(typeof(this.events.start) === "function"){
				this.events.start.call(this.obj,e);
			}
		},
		touchMoveHandler:function(e){
			e.preventDefault();
			if(!this.state){return;}
			this.savePoint(e);

			var nowtime = new Date().getTime();
			if(typeof(this.events.move) === "function" && nowtime - this.moveStartTime > this.movefnTrigerTime){
				this.moveStartTime = nowtime;
				this.events.move.call(this.obj,e);
			}
		},
		touchEndHandler:function(e){
			var thistime = new Date().getTime();

			if(!this.state){ this.state=false; return;}
			this.state=false;
			if(this.points.length<2){ return;}


			if(!(this.startTime && thistime - this.startTime <= this.allowTrigerTime) ){

				this.triggerEndFn(e);
				return;
			}


			var lastpoint=this.points[this.points.length-1];
			var lastpointx=lastpoint.x;
			var lastpointy=lastpoint.y;

//            var startpoint=this.points[this.points.length-2];
			var startpoint=this.points[0];
			var startpointx=startpoint.x;
			var startpointy=startpoint.y;


			var pointsx=Math.abs(startpointx-lastpointx);
			var pointsy=Math.abs(startpointy-lastpointy);

			//未超过最小滑动距离
			if(pointsx<this.minLength && pointsy<this.minLength){this.triggerEndFn(e);return;}

			this.startTime = thistime;
			//判断方向
			if(pointsx>=pointsy){
				//横向滑动
				if(startpointx>lastpointx){
					//左滑
					//this.obj.dispatchEvent(this.leftSlideEven);
					if(typeof(this.events.left) === "function"){
						this.events.left.call(this.obj,this.eventobj);
					}
				}else{
					//右滑
					//this.obj.dispatchEvent(this.rightSlideEven);
					if(typeof(this.events.right) === "function"){
						this.events.right.call(this.obj,this.eventobj);
					}
				}
			}else{
				//纵向滑动
				if(startpointy>lastpointy){
					//上滑
					//this.obj.dispatchEvent(this.upSlideEven);
					if(typeof(this.events.up) === "function"){
						this.events.up.call(this.obj,this.eventobj);
					}
				}else{
					//下滑
					//this.obj.dispatchEvent(this.downSlideEven);
					if(typeof(this.events.down) === "function"){
						this.events.down.call(this.obj,this.eventobj);
					}
				}
			}
		},
		triggerEndFn:function(e){
			if(typeof(this.events.end) === "function"){
				this.events.end.call(this.obj,e);
			}
		},
		savePoint:function(e){
			var touch;
			if(this.hasTouch){
				touch=e.touches[0];
			}else{
				touch=e;
			}
			this.points.push({x:touch.screenX,y:touch.screenY});
		}
	};

	var savefn = {},
		saveobj = {};

	var eventbind = function(obj){
		obj = $.getDom(obj);

		if(!$.isObject(obj)){console.log("slide bind error");return;}

		var id;
		if(obj.__bens_slide_event_id__){
			//帮定过事件
			id = obj.__bens_slide_event_id__;
		}else{
			//没有注册监听事件
			id = device.counter();
			obj.__bens_slide_event_id__ = id;
			savefn[id] = {
				up:null,
				left:null,
				down:null,
				right:null,
				end:null,
				start:null,
				move:null
			};
			saveobj[id] = new createMySlideEven({
				obj:obj,
				saveAddress:savefn[id]
			});
		}

		this.obj = obj;
		this.id = id;
		this.saveFn = savefn[id];
	};
	eventbind.prototype = {
		myslidedown:function(fn){
			if(typeof(fn) === "function"){
				this.saveFn.down = fn;
			}
			return this;
		},
		myslideup:function(fn){
			if(typeof(fn) === "function"){
				this.saveFn.up = fn;
			}
			return this;
		},
		myslideleft:function(fn){
			if(typeof(fn) === "function"){
				this.saveFn.left = fn;
			}
			return this;
		},
		myslideright:function(fn){
			if(typeof(fn) === "function"){
				this.saveFn.right = fn;
			}
			return this;
		},
		myend:function(fn){
			if(typeof(fn) === "function"){
				this.saveFn.end = fn;
			}
			return this;
		},
		mystart:function(){
			if(typeof(fn) === "function"){
				this.saveFn.start = fn;
			}
			return this;
		},
		mymoving:function(fn){
			if(typeof(fn) === "function"){
				this.saveFn.move = fn;
			}
			return this;
		},
		unbind:function(type){
			if(type && $.isBoolean(type)){
				this._removeObj();
				return;
			}


			var new_type = null;
			switch (type){
				case "mymoving":
					new_type = "move";
					break;
				case "myend":
					new_type = "end";
					break;
				case "mystart":
					new_type = "start";
					break;
				default :
					new_type = type.replace("myslide","");
					break;
			}

			type = new_type;


			if(this.saveFn[type]){
				delete this.saveFn[type];
			}

			this._checkHasFn();
			return this;
		},
		//检查是否还有事件绑定
		_checkHasFn:function(){
			var isfind = false;
			for(var key in this.saveFn){
				if(this.saveFn[key]){
					isfined = true;
					break;
				}
			}
			if(!isfind){
				this._removeObj();
			}
		},
		//解除事件绑定
		_removeObj:function(){
			var id = this.id;
			delete savefn[id];
			saveobj[id].removeEven();
			delete saveobj[id];
			delete this.obj.__bens_slide_event_id__;
		}
	};



	window.$$$ =  function(obj){
		return new eventbind(obj);
	};
})();
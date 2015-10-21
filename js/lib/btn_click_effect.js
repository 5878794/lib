/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-9-19
 * Time: 下午8:52
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */




DEVICE.BtnTouchEffect = (function(){
	var btn_effect = function(opt){
		this.bgColor = opt.bgColor || "#ccc";
		this.dom = opt.dom;
		this.time = opt.time || 300;

		this.domWidth = parseInt(this.dom.width());
		this.domHeight = parseInt(this.dom.height());
		this.domOffsetLeft = this.dom.offset().left;
		this.domOffsetTop = this.dom.offset().top;
		this.div = null;

		this.init();
	};

	btn_effect.prototype = {
		init:function(){
			this.setDomStyle();
			this.addEvent();
		},
		setDomStyle:function(){
			if(!DEVICE.checkDomHasPosition(this.dom)){
				this.dom.css({
					position:"relative"
				})
			}
			this.dom.css({
				overflow:"hidden"
			})
		},
		createDom:function(){
			var div = $("<div></div>");
			div.css3({
				width:0,height:this.domHeight+"px",
				"border-radius":"999999px",
				position:"absolute",left:"50%",top:"50%",
				"border-width":"10px",
				"border-style":"solid",
				"border-color":this.bgColor,
				"margin-left":"-10px",
				"margin-top":-this.domHeight/2 -10 + "px",
				opacity:0
			});
			return div;

		},
		addEvent:function(){
			var _this = this;
			this.dom.get(0).addEventListener(DEVICE.START_EV,this.fn = function(e){
				e = (e.touchs)? e.touches[0] : e;

				var x = e.pageX - _this.domOffsetLeft,
					y = e.pageY - _this.domOffsetTop;

				_this.showEffect(x,y);
			},false);
		},
		showEffect:function(x,y){
			if(this.div){this.div.remove();}

			var div = this.createDom();
			div.css({
				left:x +"px"
			});
			this.dom.append(div);
			this.div = div;


			div.cssAnimate({
				"border-width":"40px",
				width:this.domWidth*2 + "px",
				"margin-left": -this.domWidth - 40 + "px",
				"margin-top": -this.domHeight/2 - 40 + "px",
				opacity:1
			},this.time,function(){},true,"easy");

		}

	};

	return btn_effect;
})();
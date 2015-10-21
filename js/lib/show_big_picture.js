/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-9-11
 * Time: 下午1:49
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */



//点击小图显示全屏图
//var a = new DEVICE.showBigPicture({
//	imgs:[
//		"http://file.ynet.com/2/1509/11/10370925-500.jpg",
//		"http://file.ynet.com/2/1509/11/10370926-500.jpg"
//	]
//});

//a.showImg(0);   //0为初始显示第几张，需要自己算是点的第几张图片




DEVICE.showBigPicture = (function(){
	var showPicture = function(data){
		this.imgs = data.imgs || [];
		this.arrowImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAG+SURBVFiFvdbNi05hGMfxy3grRihjYZKEksZKsrAhWWGhlCzEhthYYM0fYCn/gJSUrbzEbmYhxcLCWI0USjE1UzN5eeZjMTaernPmOed53L+6F/fr99t9d7pOICrabjzGJK5iWc3a1q1u8oV/cxfLBy0wFNUZ7eqfjYiHEbG6Zk/z1Nidl+cZ1pZ4gsC1CokJbCghELiATiLxBptLCARO42ciMYmtJQQCxzCfSHzAzhICgUOYSSS+YG8JgcB+fEskvuNACYHAGD4nErM4XEIgsANTicQ8TpQQCIziXSLxC2dKCARG8DqR6OBiCYHAeownEnClhEBgDZ4kArNYV7Wvrho2zVxE3EvGhyNie5tq2LRdlteMiRJPcDMBw0ts+p8CQ7hTAX+qh/+GfuCr8KACfh8rezmnLXwYzyvgt//eTE9ntYGP4FUF/EbT85rCt+F9Au7gUpvbbLJ4DJ8S+A+cagNvInAQ0wl8BkfawnsVOI65BP4V+/qB9yJwzmJp7c4UdvULX0rgJBYS+FtsGQR8KYHsUxvHxkHBqa+GH7v6jyLiaERMNy2TdVlRM3c9IhYiYk8sltlbEfF7kPCIiD92sihgXGAdaAAAAABJRU5ErkJggg==";
		this.closeImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEPSURBVFiF7ZexjQIxEEW/4bQJFEALJJccHdADVVAB0bZBQBmIJg4CaICYEpDQI2CCPZ+Fh9PuWUj7JQe2v2feanfG2gCopAZFs/cAPcA7AVSSZpKCwxvMW7kiA7kxAS48dLL5M+/JvJeMV4ALYMlPfQOjhG9ke00t2wCY8ltbYNjwDG0t1rQNAAF1Ivi6sb9O7Nee2F4AAZtEkpWNWBtv3FcAPoBdIlmsnXlbBxAwBg5Pkh/M4475KoB4lNY5kfyMo+ziUbwTvtUrKP4RFi3DOpHk3xpRp63YUwXzaL6XtJB0a6zdbG2fOfunKuj0Og7g+i+oJH3aE+YOBElfko6SrrnAXoDOVLwT9gA9QHGAOyELxcimF9NPAAAAAElFTkSuQmCC";

		this.main = null;
		this.leftBtn = null;
		this.rightBtn = null;
		this.closeBtn = null;
		this.loadDom = null;
		this.imgDiv = null;

		this.nowShowDom = null;
		this.nowShowNumber = -1;
		this.canClick = true;

		this.init();
	};

	showPicture.prototype = {
		init:function(){
			this.createMain();
			this.createButton();
			this.createLoading();
			this.createImgDiv();
			this.eventBind();


			$("body").append(this.main);
		},
		createMain:function(){
			var div = $("<div></div>");
			div.css({
				width:"100%",
				height:"100%",
				position:"fixed",
				left:0,
				top:0,
				"z-index":"9999999",
				background:"rgba(0,0,0,0.0)",
				display:"none"
			});
			this.main = div;
		},
		createButton:function(){
			var leftBtn = null,
				rightBtn = $("<div></div>"),
				closeBtn = $("<div></div>");

			rightBtn.css3({
				position:"absolute",
				right:"10px",
				top:"50%",
				"margin-top":"-16px",
				width:"32px",height:"32px",
				background:"url('"+this.arrowImg+"') no-repeat center center",
				"background-size":"100% 100%",
				cursor:"pointer",
				transition:"all 0.2s linear",
				"z-index":10
			});
			leftBtn = rightBtn.clone().css3({
				left:"10px",right:"",
				transform:"rotate(180deg)"
			});
			closeBtn.css({
				position:"absolute",
				right:"10px",
				top:"10px",
				width:"32px",height:"32px",
				background:"url('"+this.closeImg+"') no-repeat center center",
				"background-size":"100% 100%",
				cursor:"pointer",
				transition:"all 0.2s linear",
				"z-index":10
			});



			this.leftBtn = leftBtn;
			this.rightBtn = rightBtn;
			this.closeBtn = closeBtn;
			this.main.append(rightBtn);
			this.main.append(leftBtn);
			this.main.append(closeBtn);
		},
		createLoading:function(){
			var div = $("<div></div>");
			div.css3({
				width:"20px",height:"20px",
				"border-radius":"32px",
				border:"2px solid #fff",
				"border-top":"none",
				"border-left":"none",
				position:"absolute",
				left:"50%",
				top:"50%",
				"margin-top":"-16px",
				"margin-left":"-16px"
			});

			div.css3Animate({
				"0%":"transform:rotate(0deg)",
				"100%":"transform:rotate(360deg)"
			},800,"ease-in",true,false);


			this.loadDom = div;
		},
		createImgDiv:function(){
			var div = $("<div class='___img_main___'></div>");
			div.css({
				width:"95%",height:"95%",
				position:"absolute",
				left:"2.5%",
				top:"2.5%"
			});
			div.append(this.loadDom);
			this.imgDiv = div;
		},
		showImg:function(n){
			this.canClick = false;

			var show_left = (n>this.nowShowNumber)? "100%" : "-100%",
				hide_left = (n<this.nowShowNumber)? "100%" : "-100%",
				div = this.imgDiv.clone().css({left:show_left}),
				img = new Image(),
				_this = this;
			this.main.append(div);

			n = (n<0)? _this.imgs.length-1 : n;
			n = (n>= _this.imgs.length)? 0 : n;
			var src = this.imgs[n];


			//动画移除img
			this.hideImg(hide_left);

			img.onload = function(){
				//设置图片大小，位置
				_this.setImgSize(this,div);
				//清除loading
				div.find("div").remove();
				//添加图片
				div.append(this);
			};
			img.src = src;


			//第一次点开
			if(!this.nowShowDom){
				this.main.css({display:"block"});
				this.main.cssAnimate({
					"background-color":"rgba(0,0,0,0.5)"
				},500,function(){

				});
				div.css({left:0});
				if(_this.nowShowDom){
					_this.nowShowDom.remove();
				}
				_this.nowShowDom = div;
				_this.nowShowNumber = n;
				_this.canClick = true;
			}else{
				div.cssAnimate({
					left:0
				},500,function(){
					if(_this.nowShowDom){
						_this.nowShowDom.remove();
					}
					_this.nowShowDom = div;
					_this.nowShowNumber = n;
					_this.canClick = true;
				});
			}



		},
		hideImg:function(hide_left){
			if(!this.nowShowDom){return;}

			this.nowShowDom.cssAnimate({
				left:hide_left
			},500)
		},
		setImgSize:function(img,div){
			var win_width = parseInt(div.width()),
				win_height = parseInt(div.height()),
				img_width = img.width,
				img_height = img.height,
				new_size = DEVICE.getNewImageSize(img_width,img_height,win_width,win_height);

			$(img).css({
				width:new_size.width+"px",
				height:new_size.height+"px",
				position:"absolute",left:"50%",top:"50%",
				"margin-left":-new_size.width/2+"px",
				"margin-top":-new_size.height/2+"px"
			})
		},
		eventBind:function(){
			var _this = this;
			this.leftBtn.click(function(){
				if(!_this.canClick){return;}
				var n = _this.nowShowNumber - 1;
				_this.showImg(n);
			});
			this.rightBtn.click(function(){
				if(!_this.canClick){return;}
				var n = _this.nowShowNumber + 1;
				_this.showImg(n);
			});
			this.closeBtn.click(function(){
				_this.destroy();
			});
		},
		destroy:function(){
			this.leftBtn.unbind("click");
			this.rightBtn.unbind("click");
			this.closeBtn.unbind("click");
			this.main.remove();
		}
	};

	return showPicture;
})();
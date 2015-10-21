/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-9-17
 * Time: 上午9:43
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */


//未测试苹果手机

//var a = new DEVICE.playMovie({
//	dom:$("#aa"),   //需要插入的dom
//	src:["gg.mp4","fll.mp4"],       //视频地址
//	poster:"3b510.jpg",             //封面
//	autoPlay:true,                  //是否自动播放,手机不支持
//	loop:true,                      //是否循环播放
//	controls:false,                 //是否屏蔽控制条
//	preload:true                    //是否预加载
//})

//a.stop();                         //停止播放
//a.destory();                      //销毁


DEVICE.playMovie = (function(){
	var playMovie = function(data){
		this.dom = data.dom; //要插入视频的位置
		this.src = data.src || []; //要播放的视频地址 数组形式
		this.poster = data.poster;   //封面
		this.controls = $.isBoolean(data.controls)? data.controls : false;  //是否显示控制条 手机不支持
		this.preload = $.isBoolean(data.preload)? data.preload : true;  //是否预加载

		this.autoPlay = $.isBoolean(data.autoPlay)? data.autoPlay : false;  //自动播放 手机不支持
		this.loop = $.isBoolean(data.loop)? data.loop : false;          //是否循环播放


		this.width = parseInt(this.dom.width());
		this.height = parseInt(this.dom.height());

		this.nowPlay = -1;           //当前播放第几个视频
		this.video = null;          //video对象
		this.posterDom = null;      //封面dom对象
		this.zz = null;             //遮罩层 防止视频点击出现控制条

		this.isStart = false;

		//手机不支持自动播放
		if(DEVICE.isPhone){
			this.autoPlay = false;
		}


		this.init();
	};

	playMovie.prototype = {
		init:function(){
			this.createDom();
			this.createPoster();
			this.createZZ();
			this.addEvent();
		},
		createDom:function(){
			var video = $("<video></video>").get(0);
			video.src = this.src[0];

			if(this.preload){video.preload = "auto";}
			if(this.controls){video.controls = "controls";}

			video.width = 1;
			video.height = 1;

			this.dom.append(video);
			this.video = video;
		},
		createPoster:function(){
			this.dom.css({position:"relative",background:"#000"});
			var div = $("<div></div>");
			div.css3({
				position:"absolute",
				left:0,top:0,width:"100%",height:"100%",
				cursor:"pointer",
				"z-index":"20"
			});
			if(this.poster){
				div.css3({
					background:"url("+this.poster+") no-repeat center center",
					"background-size":"100% 100%"
				});
			}

			var playBtn = $("<div></div>");
			playBtn.css({
				"border-left":"34px solid #fff",
				"border-top":"20px solid transparent",
				"border-bottom":"20px solid transparent",
				position:"absolute",
				left:"50%",top:"50%",
				"margin-top":"-17px","margin-left":"-10px"
			});
			var playRound = $("<div></div>");
			playRound.css3({
				width:"60px",height:"60px",
				"border-radius":"60px",
				border:"3px solid #fff",
				position:"absolute",
				left:"50%",top:"50%",
				"margin-top":"-30px","margin-left":"-30px"
			});
			div.append(playRound);
			div.append(playBtn);


			this.dom.append(div);

			this.posterDom = div;

		},
		createZZ:function(){
			//防止点击出现控制条
			var div = $("<div></div>"),
				display = (this.controls)? "none" : "block";

			div.css({
				position:"absolute",
				left:0,top:0,width:"100%",height:"100%",
				"z-index":10,
				background:"rgba(0,0,0,0)",
				display:display
			});
			this.zz = div;
			this.dom.append(div);
		},
		addEvent:function(){
			var _this = this;


			//封面点击播放
			this.posterDom.click(function(){
				_this.play();
			});


			//已准备好
			this.video.addEventListener("canplaythrough",_this.fn1 = function(){
				if(_this.autoPlay && !_this.isStart){
					_this.play();
				}
			},false);

			////播放结束
			this.video.addEventListener("ended",_this.fn2 = function(){
				if(_this.loop){
					_this.play();
				}
			},false);
		},
		play:function(){
			var _this = this;
			_this.isStart = true;

			_this.nowPlay++;
			_this.nowPlay = (_this.nowPlay>= _this.src.length)? 0 : _this.nowPlay;
			if(_this.src[_this.nowPlay] != _this.video.src){
				_this.video.src = _this.src[_this.nowPlay];
			}

			_this.video.width = _this.width;
			_this.video.height = _this.height;

			this.posterDom.css({display:"none"});
			_this.video.play();
		},
		stop:function(){
			this.video.stop();
		},
		destroy:function(){
			this.video.stop();
			this.posterDom.unbind("click");
			this.video.removeEventListener("canplaythrough",this.fn1,false);
			this.video.removeEventListener("ended",this.fn2,false);

			$(this.video).remove();
			this.zz.remove();
			this.posterDom.remove();
		}

	};


	return playMovie;
})();
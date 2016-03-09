/**
 * Created by beens on 15/11/11.
 */


//注意： ios支持aiff不支持MP3，chrome不支持aiff
//在线MP3转aiff地址   http://audio.online-convert.com/convert-to-aiff
//8000hz  mone(单声道)

//new DEVICE.audio({
//    src:"bg1.mp3",            //@param:str     播放的音频地址
//    ready:function(){         //缓存准备好后播放
//        this.play({
//            loop:true,        //@param:bool
//            delay:10,         //@param:number  延迟多久开始播放  单位：秒
//            start:12,         //@param:number  播放从第几秒开始,设置循环时有bug，会从第1秒开始  单位：秒
//            continued:12      //@param:number  播放多长时间     单位：秒
//        })
//    },
//    error:function(filename){ //缓存失败回调
//
//    }
//});




DEVICE.audio = (function(){
    window.AudioContext = window.AudioContext ||
        window.webkitAudioContext ||
        window.mozAudioContext ||
        window.msAudioContext;

    var audioTag = !!(document.createElement("audio").canPlayType),
        audio;


    //audio api
    if(!!window.AudioContext){
    	//支持
    	audio = function(data){
    		this.src = data.src;                      //文件地址
    		this.ready = data.ready || function(){};  //预加载完使用
    		this.error = data.error || function(){};  //出错回调
    		this.fileName = this.src.substr(this.src.lastIndexOf("/")+1);

    		this.ac = new AudioContext();
    		this.buffer = null;                       //buffer缓存
    		this.source = null;                       //声音源

    		this.playedTime = 0;
    		this.startPlayTime = 0;


    		this.cache();
    	};

    	audio.prototype = {
    		cache:function(){
    			var request = new XMLHttpRequest(),
    				_this = this;

    			request.open('GET', this.src, true);
    			request.responseType = 'arraybuffer';

    			//下载声音文件]
    			request.onreadystatechange = function(){
    				if(request.readyState == 4){
    					if(request.status >= 200 && request.status < 300){
    						_this.bufferData(request.response);
    					}else{
    						_this.error(_this.fileName);
    					}
    				}
    			};

    			request.send();
    		},
    		bufferData:function(rs){
    			var _this = this;
    			//解码
    			this.ac.decodeAudioData(rs, function(buffer) {
    				_this.buffer = buffer;
    				_this.ready.call(_this);
    			}, function(){
    				_this.error(_this.fileName);
    			});
    		},
    		play:function(data){
    			data = data || {};

    			//是否循环播放
    			var loop = data.loop || false,
    			//延迟多久开始播放（秒）
    				delay = data.delay || 0,
    			//开始播放时间（秒）
    				start = data.start || this.playedTime,
    			//播放多久（秒）
    				continued = data.continued || this.buffer.duration - this.playedTime;
    			//记录开始播放时间
    			this.startPlayTime = this.ac.currentTime;
    			// 创建一个声音源
    			this.source = this.ac.createBufferSource();
    			// 告诉该源播放何物
    			this.source.buffer = this.buffer;

    			//将该源与硬件相连
    			this.source.connect(this.ac.destination);

    			//现在播放该实例
    			this.source.start(delay,start,continued);
                //循环
                this.source.loop = loop;

    		},
    		stop:function(){
    			this.playedTime += this.ac.currentTime - this.startPlayTime;

    			this.source.stop();
    		}
    	};

    }


    //audio tag
    if(!window.AudioContext && audioTag){
    //支持audio标签
    audio = function(data){
        this.src = data.src;                      //文件地址
        this.ready = data.ready || function(){};  //预加载完使用
        this.error = data.error || function(){};  //出错回调
        this.fileName = this.src.substr(this.src.lastIndexOf("/")+1);

        //audio标签
        this.tag = null;


        this.delayTimeOut = null;
        this.playTimeOut = null;

        this.canPlayFn = null;
        this.loadErrorFn = null;


        this.createTag();
        this.cache();
    };

    audio.prototype = {
        createTag:function(){
            var tag = document.createElement("audio");
            tag.src = this.src;

//                    var tag = new Audio(this.src);
            tag.preload = "auto";
//                    tag.controls = true;
            tag.style.cssText = "display:none;";

            this.tag = tag;
            $("body").append(tag);
            //document.body.appendChild(tag);
        },
        cache:function(){
            var _this = this;
            _this.tag.addEventListener("canplaythrough",_this.canPlayFn = function(){
                _this.tag.removeEventListener("canplaythrough",_this.canPlayFn,false);
                _this.ready.call(_this);
            },false);

            _this.tag.addEventListener("error", _this.loadErrorFn = function(){
                _this.tag.removeEventListener("error",_this.loadErrorFn,false);
                _this.error(_this.fileName);
            },false);
        },
        play:function(data){
            clearTimeout(this.delayTimeOut);
            clearTimeout(this.playTimeOut);
            this.stop();
            data = data || {};

            var loop = data.loop || false,
            //延迟多久开始播放（秒）
                delay = (parseInt(data.delay))? parseInt(data.delay) : 0,
            //开始播放时间（秒）
                start = (parseInt(data.start) || parseInt(data.start) == 0 )? parseInt(data.start) : this.tag.currentTime,
            //播放多久（秒）
                continued = parseInt(data.continued) + delay,
                _this = this;

            this.tag.loop = loop;
            this.tag.currentTime = start;
            if(delay != 0){
                this.delayTimeOut = setTimeout(function(){
                    _this.tag.play();
                },delay*1000);
            }else{
                _this.tag.play();
            }

            if(continued){
                this.playTimeOut = setTimeout(function(){
                    _this.tag.pause();
                },continued*1000)
            }
        },
        stop:function(){
            clearTimeout(this.delayTimeOut);
            clearTimeout(this.playTimeOut);
            this.tag.pause();
        }
    };

    }



    return audio;
})();
/**
 * Created by beens on 15/11/16.
 */




//获取摄像头照相，获取到的图片比例4：3
//var a = new DEVICE.getUserMedia({
//    dom:dom,                  //@param:jqdom   要实时显示的dom容器
//    errorFn:function(msg){}   //@param:fn      出错时回调
//});

////获取图片，返回base64格式
//a.getImage();

//判断是否支持
//a.isSupport();


//支持：chrome,firefox，edge，opera  手机目前只有chrome支持




DEVICE.getUserMedia = (function(){
    var getUserMedia = function(opt){
        this.dom = opt.dom;
        this.errorFn = opt.errorFn || function(){};


        this._checkSupport();
        if(!this.getMedia){
            this.errorFn("not support getUserMedia api !");
            return;
        }

        this.domWidth = parseInt(this.dom.width());
        this.domHeight = parseInt(this.dom.height());
        this.videoWidth = 0;
        this.videoHeihgt = 0;

        this.video = null;
        this.canvas = null;
        this.ctx = null;

        this._init();
    };
    getUserMedia.prototype = {
        _init:function(){
            this._getVideoSize();
            this._createVideo();
            this._createCanvas();
            this._play();
        },
        isSupport:function(){
            return (this.getMedia)? true :false;
        },
        _getVideoSize:function(){
            //视频比例必须为4：3  要不最终输出图片会被拉伸，很奇怪
            if(this.domWidth/this.domHeight > 4/3){
                this.videoWidth = 4*this.domHeight/3;
                this.videoHeihgt = this.domHeight;
            }else{
                this.videoWidth = this.domWidth;
                this.videoHeihgt = this.domWidth*3/4;
            }
        },
        _checkSupport:function(){
            navigator.getMedia =  navigator.getUserMedia ||
                                  navigator.webkitGetUserMedia ||
                                  navigator.mozGetUserMedia ||
                                  navigator.msGetUserMedia;

            this.getMedia = navigator.getMedia;
        },
        _createVideo:function(){
            var video = $("<video autoplay width='"+this.videoWidth+"' height='"+this.videoHeihgt+"'></video>");
            this.dom.append(video);
            this.video = video;

            video.css({
                "margin-top":(this.domHeight-this.videoHeihgt)/2 + "px",
                "margin-left":(this.domWidth - this.videoWidth)/2 + "px"
            })

        },
        _play:function(){
            var _this = this;

            navigator.getMedia (
                // constraints
                {
                    video: true,
                    audio: false
                },
                // successCallback
                function(localMediaStream) {
                    _this.localMediaStream = localMediaStream;
                    _this.video.get(0).src = window.URL.createObjectURL(localMediaStream);
                    _this.video.get(0).onloadedmetadata = function(e) {
                        _this.video.get(0).play();
                    };
                },
                // errorCallback
                function(err) {
                    var _this = this;
                    _this.errorFn(err);
                }

            );
        },
        _createCanvas:function(){
            var canvas = $("<canvas></canvas>"),
                ctx = canvas.get(0).getContext("2d");

            canvas.get(0).width = this.videoWidth;
            canvas.get(0).height = this.videoHeihgt;


            this.ctx = ctx;
            this.canvas = canvas;
        },
        getImage:function(){
            this.ctx.drawImage(this.video.get(0),0,0,this.videoWidth,this.videoHeihgt);
            var src = this.canvas.get(0).toDataURL("image/png");

            return src;
        },
        stop:function(){
            if(this.localMediaStream){
                if(this.localMediaStream.stop){
                    this.localMediaStream.stop();
                }
                var track = this.localMediaStream.getTracks() || [];
                track = track[0];
                if(track.stop){
                    track.stop();
                }
                this.video.get(0).src = "";
            }
        }
    };

    return getUserMedia;
})();
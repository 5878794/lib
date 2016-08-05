/**
 * Created by beens on 16/8/2.
 */


//双指缩放、旋转 （监听的window对象）
//new DEVICE.mulit_touch_evnet({
//    maxScale:4,         //最大放大到倍数
//    minScale:0.25,      //最大缩小到倍数
//    //执行函数，回传缩放大小和度数  最好只用1个，同时执行体验不好未做处理
//    changeFn:function(scale,deg){
//        $("#test").css3({
//            transform:"scale("+scale+") rotate("+deg+"deg)"
//        })
//    }
//});



DEVICE.mulit_touch_evnet = class multiTouchEvent{
    constructor(opt){
        this.changeFn= opt.changeFn || function(){};

        //this.startRotateDeg = 5;
        //this.startZoomLength = 10;
        this.touchBeforeMoveNumber = 0;        //手指移动前触摸的数量
        this.startPoints = null;
        this.points = [];
        this.angleFn = DEVICE.angle;

        this.deg = 0;
        this.scale = 1;
        this.maxScale = opt.maxScale || 4;
        this.minScale = opt.minScale || 0.25;

        this._addEvent();
    }

    _addEvent(){
        window.addEventListener(DEVICE.START_EV,(e)=>{
            e = e.touches || e;
            this._startEvent(e);
        },false);
        window.addEventListener(DEVICE.MOVE_EV,(e)=>{
            e.preventDefault();
            e = e.touches || e;
            this._moveEvent(e);
        },false);
        window.addEventListener(DEVICE.END_EV,(e)=>{
            e = e.touches || e;
            this._endEvent(e);
        },false);
        window.addEventListener(DEVICE.CANCEL_EV,(e)=>{
            e = e.touches || e;
            this._endEvent(e);
        },false);
    }

    _startEvent(e){
        this._savePoint(e);


    }
    _moveEvent(e){
        if(this.touchBeforeMoveNumber == 0){
            this.touchBeforeMoveNumber = e.length;
            this.startPoints = this.points[this.points.length - 1];
        }


        this._savePoint(e);

        if(e.length == 2 && this.touchBeforeMoveNumber == 2){
            //判断是缩放还是旋转
            this._handler2Touches();
        }


    }
    _endEvent(e){
        //获取到的是点击时的点的位置

        //手指全部离开
        if(e.length == 0){
            this._delPoint();
        }else{
            this._savePoint(e);
        }
    }


    _savePoint(e){
        var new_e = JSON.parse(JSON.stringify(e));
        this.points.push(new_e);
    }
    _delPoint(){
        this.points = [];
        this.startPoints = null;
        this.touchBeforeMoveNumber = 0;
    }

    _handler2Touches(){
        if(this.points.length < 2){return;}

        let points = this.points,
            //startPoints = this.startPoints,
            startPoints = points[points.length-2],
            endPoints = points[points.length-1];

        if(startPoints.length != 2 || endPoints.length != 2 ){
            return;
        }

        let abs = Math.abs,
            sqrt = Math.sqrt,
            s1_x = startPoints[0].screenX,  //起始点1
            s1_y = startPoints[0].screenY,
            s2_x = startPoints[1].screenX,  //起始点2
            s2_y = startPoints[1].screenY,
            e1_x = endPoints[0].screenX,    //结束点1
            e1_y = endPoints[0].screenY,
            e2_x = endPoints[1].screenX,    //结束点2
            e2_y = endPoints[1].screenY,
            c_x = s1_x + (s2_x - s1_x)/2,   //中心点1
            c_y = s1_y + (s2_y - s1_y)/2,
            s_l = sqrt((s1_x - s2_x)*(s1_x - s2_x) + (s1_y - s2_y)*(s1_y - s2_y)),
            e_l = sqrt((e1_x - e2_x)*(e1_x - e2_x) + (e1_y - e2_y)*(e1_y - e2_y)),
            //2指前后移动距离差
            move = e_l - s_l,
            //手指1移动的角度
            deg1 = this.angleFn({x:s1_x,y:s1_y},{x:c_x,y:c_y},{x:e1_x,y:e1_y}),
            deg2 = this.angleFn({x:s2_x,y:s2_y},{x:c_x,y:c_y},{x:e2_x,y:e2_y}),
            touch1IsClockwise = this._clockwise({x:s1_x,y:s1_y},{x:c_x,y:c_y},{x:e1_x,y:e1_y}),
            touch2IsClockwise = this._clockwise({x:s1_x,y:s1_y},{x:c_x,y:c_y},{x:e1_x,y:e1_y});


        let scale = ( move >= 0)? this.scale + move/100 : this.scale + move/100;
        scale = DEVICE.getBetweenNumber(scale,this.minScale,this.maxScale);
        this.scale = scale;


        let deg = (deg1 > deg2)? deg1 : deg2;
        if(touch1IsClockwise == touch2IsClockwise){
            deg = (touch1IsClockwise)? deg : -deg;
            deg = this.deg + deg;
            this.deg = deg;
        }else{
            deg = this.deg;
        }

        this.changeFn(scale,deg);

        //console.log(touch1IsClockwise+" "+touch2IsClockwise)
    }

    //判断向量p2p3 是否在向量p2p1的顺时针 （三角形的三点）
    _clockwise(p1,p2,p3){
        var dx1 = p1.x - p2.x,
            dy1 = p1.y - p2.y,
            dx2 = p3.x - p2.x,
            dy2 = p3.y - p2.y,
            dx = dx1*dy2 - dx2*dy1;

        return (dx>0);

    }


};


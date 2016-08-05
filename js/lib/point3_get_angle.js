/**
 * Created by beens on 16/8/4.
 */


//通过三角形的三个定点坐标计算角度

//DEVICE.angle(
//    {x:100,y:0},        //3个点的坐标x，y
//    {x:0,y:0},
//    {x:0,y:100}
//);

//注意：计算的是p2点的夹角的角度

DEVICE.angle = function(p1,p2,p3){
    var dx1 = p1.x - p2.x,
        dy1 = p1.y - p2.y,
        dx2 = p3.x - p2.x,
        dy2 = p3.y - p2.y;

    var c = Math.sqrt(dx1*dx1+dy1*dy1)*Math.sqrt(dx2*dx2+dy2*dy2),
        d;
    if(c == 0){
        d = -1;
    }else{
        d = Math.acos((dx1*dx2+dy1*dy2)/c);
    }

    d = d/Math.PI*180;
    return (d)? d: 0;
};



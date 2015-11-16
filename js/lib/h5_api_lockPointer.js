/**
 * Created by beens on 15/11/16.
 */




//依赖DEVICE.API.fullScreen
//锁定鼠标（隐藏鼠标，避免移动到窗口外）
//必须在全屏模式下使用
//锁定事件锁定或解锁时触发事件   DEVICE.LOCKPOINTER_EV



//获取当前锁定的元素，返回dom
//DEVICE.getLockPointDom();


//注意：鼠标锁定的元素必须与全屏元素相同
//$(document).click(function(){
//      var elem = document.documentElement
//    DEVICE.lockPointer(elem);         //必须优先于全屏执行，里面有监听函数
//    DEVICE.API.fullScreen(elem);
//
//    setTimeout(function(){
//        DEVICE.unlockPointer();       //退出锁定
//    },5000);
//});




//注意：锁定鼠标后鼠标移动事件的坐标需要使用  e.pageX e.pageY 移动时会获得固定的值
//  movementX和movementY 获取鼠标移动的距离，停止后变为0
// document.addEventListener("mousemove", function(e) {
//    var movementX = e.movementX       ||
//            e.mozMovementX    ||
//            e.webkitMovementX ||
//            0,
//        movementY = e.movementY       ||
//            e.mozMovementY    ||
//            e.webkitMovementY ||
//            0;
//
//    // 打印鼠标移动的增量值。
//    console.log("movementX=" + movementX, "movementY=" + movementY);
//}, false);




DEVICE.getLockPointDom = function(){
    document.pointerLockElement = document.pointerLockElement    ||
        document.mozPointerLockElement ||
        document.webkitPointerLockElement;

    return document.pointerLockElement;
};


DEVICE.lockPointer = function(elem){
    var lock = function(){
        elem = elem || document.documentElement;

        if (document.fullscreenElement === elem ||
            document.webkitFullscreenElement === elem ||
            document.mozFullscreenElement === elem ||
            document.mozFullScreenElement === elem) { // 较旧的 API 大写 'S'.

            elem.pointerLockElement = elem.pointerLockElement    ||
                elem.mozPointerLockElement ||
                elem.webkitPointerLockElement;

            elem.requestPointerLock();
        }
    };

    document.addEventListener(DEVICE.FULLSCREEN_EV, lock, false);
};

DEVICE.unlockPointer = function(){
    document.exitPointerLock = document.exitPointerLock    ||
        document.mozExitPointerLock ||
        document.webkitExitPointerLock;

    document.exitPointerLock();
};
//重力感应


DEVICE.gravitySensor = class sensor{
    constructor(opt){


        this._init();
    }

    _init(){
        this._addEvent();

    }

    _addEvent(){
        window.addEventListener("devicemotion", function(event) {
            console.log(event)
        }, true);
    }
};
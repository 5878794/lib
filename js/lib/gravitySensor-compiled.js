"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//重力感应

DEVICE.gravitySensor = function () {
    function sensor(opt) {
        _classCallCheck(this, sensor);

        this._init();
    }

    _createClass(sensor, [{
        key: "_init",
        value: function _init() {
            this._addEvent();
        }
    }, {
        key: "_addEvent",
        value: function _addEvent() {
            window.addEventListener("devicemotion", function (event) {
                console.log(event);
            }, true);
        }
    }]);

    return sensor;
}();

//# sourceMappingURL=gravitySensor-compiled.js.map
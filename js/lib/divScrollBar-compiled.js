"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//div 生成模拟的滚动条

//new DEVICE.divScrollBar({
//    id:"test1",               //div的id
//    background:"#ececec",     //滚动条的背景色
//    color:"#333",             //滚动条颜色
//    scrollBarWidth:12,        //滚动巢的宽度
//    checkDomResizeTime:500,    //检查dom变化的时间\
//    scrollAnimateLength:30,     //window系统下滚动条每次滚动的距离
//    animateTime:400           //每次滚动的时间
//});

DEVICE.divScrollBar = function () {
    function divScrollBar(opt) {
        _classCallCheck(this, divScrollBar);

        this.id = opt.id;
        this.background = opt.background || "#ececec";
        this.color = opt.color || "#333";
        this.scrollBarWidth = opt.scrollBarWidth || 12;
        this.checkDomResizeTime = opt.checkDomResizeTime || 500;
        this.scrollAnimateLength = opt.scrollAnimateLength || 30;
        this.animateTime = opt.animateTime || 400;

        //PARAM
        this.scrollTop = 0;
        this.scrollLeft = 0;
        this.maxScrollTop = 0;
        this.maxScrollLeft = 0;
        this.scrollXLength = 0;
        this.scrollYLength = 0;

        this.hasMouseDownX = false;
        this.hasMouseDownY = false;
        this.startMousePointX = 0;
        this.startMousePointY = 0;

        this.htmlWidth = 0;
        this.htmlHeight = 0;
        this.bodyWidth = 0;
        this.bodyHeight = 0;

        this.isShowScrollX = false;
        this.isShowScrollY = false;

        this.intervalFn = null;
        this.animateFn = null;

        //DOM
        this.dom = $("#" + this.id);
        this.html = null;
        this.body = null;
        this.scrollBarX = null;
        this.scrollerX = null;
        this.scrollBarY = null;
        this.scrollerY = null;

        this._init();
    }

    _createClass(divScrollBar, [{
        key: "_init",
        value: function _init() {
            this._createDom();
            this._createScrollY();
            this._createScrollX();
            this._refresh();
            this._addEventListener();
        }
    }, {
        key: "_createDom",
        value: function _createDom() {
            this.dom.css({
                position: "relative"
            });

            var div = $("<div></div>"),
                div1 = $("<div></div>");

            div.css({
                position: "absolute",
                //background:"red",
                left: 0, top: 0, right: 0, bottom: 0,
                overflow: "hidden"
            });
            div1.css({
                display: "inline-block"
            });

            var children = this.dom.children();
            div.append(div1);
            div1.append(children);
            this.dom.append(div);

            this.html = div;
            this.body = div1;
        }
    }, {
        key: "_createScrollY",
        value: function _createScrollY() {
            var div = $("<div></div>"),
                div1 = $("<div></div>");

            div.append(div1);
            this.dom.append(div);

            this.scrollBarY = div;
            this.scrollerY = div1;

            div.css({
                position: "absolute",
                top: 0,
                right: 0,
                width: this.scrollBarWidth + "px",
                bottom: 0,
                background: this.background,
                display: "none",
                cursor: "default"
            });

            div1.css3({
                position: "absolute",
                left: "20%",
                top: 0,
                width: "60%",
                height: "20px",
                background: this.color,
                "border-radius": this.scrollBarWidth + "px",
                "font-size": 0,
                "-webkit-text-size-adjust": "none",
                cursor: "default"
            });
        }
    }, {
        key: "_createScrollX",
        value: function _createScrollX() {
            var div = $("<div></div>"),
                div1 = $("<div></div>");

            div.append(div1);
            this.dom.append(div);

            this.scrollBarX = div;
            this.scrollerX = div1;

            div.css({
                position: "absolute",
                right: 0,
                left: 0,
                height: this.scrollBarWidth + "px",
                bottom: 0,
                background: this.background,
                display: "none",
                cursor: "default"
            });

            div1.css3({
                position: "absolute",
                left: 0,
                top: "20%",
                width: "20px",
                height: "60%",
                background: this.color,
                "border-radius": this.scrollBarWidth + "px",
                cursor: "default"
            });
        }
    }, {
        key: "_refresh",
        value: function _refresh() {
            this.htmlWidth = parseInt(this.html.outerWidth());
            this.htmlHeight = parseInt(this.html.outerHeight());
            this.bodyWidth = parseInt(this.body.width());
            this.bodyHeight = parseInt(this.body.height());

            this._hideScrollBar();

            //判断是否显示滚动条
            if (this.bodyWidth > this.htmlWidth) {
                //横向有滚动条
                this.htmlHeight = this.htmlHeight - this.scrollBarWidth;
                this._showScrollBar("x");
                if (this.bodyHeight > this.htmlHeight) {
                    //纵向有滚动条
                    this.htmlWidth = this.htmlWidth - this.scrollBarWidth;
                    this._showScrollBar("y");
                }
            } else {
                if (this.bodyHeight > this.htmlHeight) {
                    //纵向有滚动条
                    this.htmlWidth = this.htmlWidth - this.scrollBarWidth;
                    this._showScrollBar("y");
                    this.bodyWidth = parseInt(this.body.width());
                    if (this.bodyWidth > this.htmlWidth) {
                        //横向有滚动条
                        this.htmlHeight = this.htmlHeight - this.scrollBarWidth;
                        this._showScrollBar("x");
                    }
                }
            }

            //最大滚动距离
            this.maxScrollTop = this.bodyHeight - this.htmlHeight;
            this.maxScrollLeft = this.bodyWidth - this.htmlWidth;

            //滚动条自身长度
            this.scrollXLength = this.htmlWidth * this.htmlWidth / this.bodyWidth;
            this.scrollYLength = this.htmlHeight * this.htmlHeight / this.bodyHeight;
            this.scrollerX.css({ width: this.scrollXLength + "px" });
            this.scrollerY.css({ height: this.scrollYLength + "px" });
        }
    }, {
        key: "_showScrollBar",
        value: function _showScrollBar(type) {
            if (type == "x") {
                this.html.css({ "padding-bottom": this.scrollBarWidth + "px" });
                this.scrollBarX.css({ display: "block" });
                this.isShowScrollX = true;
            } else {
                this.html.css({ "padding-right": this.scrollBarWidth + "px" });
                this.scrollBarY.css({ display: "block" });
                this.isShowScrollY = true;
            }
        }
    }, {
        key: "_hideScrollBar",
        value: function _hideScrollBar() {
            this.html.css({ padding: 0 });
            this.scrollBarX.css({ display: "none" });
            this.scrollBarY.css({ display: "none" });
            this.isShowScrollX = false;
            this.isShowScrollY = false;
        }
    }, {
        key: "_addEventListener",
        value: function _addEventListener() {
            var _this2 = this;

            //鼠标滚轮事件
            this.dom.mousewheel(function (e) {
                e.preventDefault();
                var deltaX = e.deltaX;
                var deltaY = e.deltaY;


                if (DEVICE.isMac) {
                    _this2.move(-deltaX, deltaY);
                    return;
                }

                //window系统无法获取滚动的实际距离，只有动画模拟
                deltaX = deltaX > 0 ? _this2.scrollAnimateLength : deltaX < 0 ? -_this2.scrollAnimateLength : 0;
                deltaY = deltaY > 0 ? _this2.scrollAnimateLength : deltaY < 0 ? -_this2.scrollAnimateLength : 0;

                _this2.scrollAnimate(-deltaX, deltaY);
            });

            //滚动条点击事件
            this.scrollerX.get(0).addEventListener("mousedown", function (e) {
                e.stopPropagation();
                e.preventDefault();
                _this2._mouseDown("x", e);
            }, false);
            this.scrollerY.get(0).addEventListener("mousedown", function (e) {
                e.stopPropagation();
                e.preventDefault();
                _this2._mouseDown("y", e);
            }, false);
            document.body.addEventListener("mousemove", function (e) {
                _this2._mouseMove(e);
            }, false);
            document.body.addEventListener("mouseup", function (e) {
                _this2._mouseUp();
            }, false);
            this.scrollerX.get(0).addEventListener("click", function (e) {
                e.stopPropagation();
                e.preventDefault();
            }, false);
            this.scrollerY.get(0).addEventListener("click", function (e) {
                e.stopPropagation();
                e.preventDefault();
            }, false);

            //滚动巢事件
            this.scrollBarX.get(0).addEventListener("click", function (e) {
                _this2._scrollBarClick("x", e);
            }, false);
            this.scrollBarY.get(0).addEventListener("click", function (e) {
                _this2._scrollBarClick("y", e);
            }, false);

            //检查容器大小是否变化
            this.intervalFn = setInterval(function () {
                _this2._checkDomResize();
            }, this.checkDomResizeTime);
        }
    }, {
        key: "scrollAnimate",
        value: function scrollAnimate(x, y) {
            if (this.animateFn) {
                this.animateFn.stop();
            }
            var _this = this;

            this.animateFn = new DEVICE.jsAnimate({
                start: 0, //@param:number   初始位置
                end: 1, //@param:number   结束位置
                time: this.animateTime, //@param:number   动画执行时间  ms
                type: "Cubic", //@param:str      tween动画类别,默认：Linear 详见函数内tween函数
                class: "easeOut", //@param:str      tween动画方式,默认：easeIn 详见函数内tween函数
                stepFn: function stepFn(val) {
                    //@param:fn       每步执行函数,返回当前属性值
                    _this.move(val * x, val * y);
                },
                endFn: function endFn() {//@param:fn       动画结束执行

                },
                alternate: false, //@param:boolean  动画结束时是否反向运行，默认：false
                infinite: false //@param:boolean  动画是否循环执行，默认：false
                //设置该参数endFn将失效
            });
            this.animateFn.play();

            //this.move(x,y);
        }
    }, {
        key: "move",
        value: function move(x, y) {
            var abs = Math.abs;


            if (this.isShowScrollY && y != 0) {
                this.scrollTop += y;
                this.scrollTop = DEVICE.getBetweenNumber(this.scrollTop, -this.maxScrollTop, 0);
                //移动滚动条
                var top = abs(this.scrollTop) / this.maxScrollTop * (this.htmlHeight - this.scrollYLength);
                this.scrollerY.css3({
                    transform: "translateY(" + top + "px)"
                });
            }

            if (this.isShowScrollX && x != 0) {
                this.scrollLeft += x;
                this.scrollLeft = DEVICE.getBetweenNumber(this.scrollLeft, -this.maxScrollLeft, 0);
                //移动滚动条
                var left = abs(this.scrollLeft) / this.maxScrollLeft * (this.htmlWidth - this.scrollXLength);
                this.scrollerX.css3({
                    transform: "translateX(" + left + "px)"
                });
            }

            //移动dom
            this.body.css3({
                transform: "translateY(" + this.scrollTop + "px) translateX(" + this.scrollLeft + "px)"
            });
        }
    }, {
        key: "_mouseDown",
        value: function _mouseDown(type, e) {
            if (type == "y") {
                this.hasMouseDownY = true;
                this.startMousePointY = e.clientY;
            }

            if (type == "x") {
                this.hasMouseDownX = true;
                this.startMousePointX = e.clientX;
            }
        }
    }, {
        key: "_mouseMove",
        value: function _mouseMove(e) {
            if (this.hasMouseDownY) {
                var y = e.clientY,
                    len = y - this.startMousePointY;
                this.startMousePointY = y;
                len = this.maxScrollTop * len / (this.htmlHeight - this.scrollYLength);

                this.move(0, -len);
            }

            if (this.hasMouseDownX) {
                var x = e.clientX,
                    len = x - this.startMousePointX;
                this.startMousePointX = x;
                len = this.maxScrollLeft * len / (this.htmlWidth - this.scrollXLength);

                this.move(-len, 0);
            }
        }
    }, {
        key: "_mouseUp",
        value: function _mouseUp() {
            this.hasMouseDownX = false;
            this.hasMouseDownY = false;
        }
    }, {
        key: "_scrollBarClick",
        value: function _scrollBarClick(type, e) {
            var abs = Math.abs;


            if (type == "y") {
                var p = e.clientY - this.scrollBarY.offset().top,
                    y = abs(this.scrollTop) / this.maxScrollTop * (this.htmlHeight - this.scrollYLength),
                    max_y = y + this.scrollYLength;

                if (p < y) {
                    //点的滚动条上面的滚动巢
                    this.move(0, this.htmlHeight);
                } else if (p > max_y) {
                    //点的滚动条下面的滚动巢
                    this.move(0, -this.htmlHeight);
                }
            }

            if (type == "x") {
                var p = e.clientX - this.scrollBarX.offset().left,
                    x = abs(this.scrollLeft) / this.maxScrollLeft * (this.htmlWidth - this.scrollXLength),
                    max_x = x + this.scrollXLength;

                if (p < x) {
                    //点的滚动条上面的滚动巢
                    this.move(this.htmlWidth, 0);
                } else if (p > max_x) {
                    //点的滚动条下面的滚动巢
                    this.move(-this.htmlWidth, 0);
                }
            }
        }
    }, {
        key: "_checkDomResize",
        value: function _checkDomResize() {
            var height = parseInt(this.html.outerHeight()),
                width = parseInt(this.html.outerWidth);

            if (height != this.htmlHeight || width != this.htmlWidth) {
                this._refresh();
            }
        }
    }]);

    return divScrollBar;
}();

var c;
$(document).ready(function () {
    c = new DEVICE.divScrollBar({ id: "test1" });
});

//# sourceMappingURL=divScrollBar-compiled.js.map
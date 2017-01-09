"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}DEVICE.stepAnimate=function(){function stepAnimate(opt){_classCallCheck(this,stepAnimate);this.dom=opt.dom;this.children=this.dom.children();this.style=opt.style||{};this.runTime=opt.runTime||500;this.stepTime=opt.stepTime||10;this.animateType=opt.animateType||"linear";this.infinite=opt.infinite||false;this.alternate=opt.alternate||false;this.callback=opt.callback||"";this.delayTime=opt.delayTime||0;this.willChange=opt.willChange||"auto";this._init();}_createClass(stepAnimate,[{key:"_init",value:function _init(){this._run();}},{key:"_run",value:function _run(){for(var i=0,l=this.children.length;i<l;i++){var this_dom=this.children[i],delayTime=this.delayTime+i*this.stepTime,callback=function callback(){},_this=this;if(i==l-1){callback=function callback(){var dom=$(this).parent();_this.callback.call(dom.get(0));};}$(this_dom).classAnimate(this.style,this.runTime,this.animateType,this.infinite,this.alternate,callback,delayTime,this.willChange);}}}]);return stepAnimate;}();$.fn.childrenStepAnimate=function(opt){opt.dom=$(this);new DEVICE.stepAnimate(opt);};

//# sourceMappingURL=stepAnimate-compiled.js.map
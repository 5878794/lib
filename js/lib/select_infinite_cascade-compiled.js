"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}DEVICE.infiniteCascadeSelect=function(){function select(opt){_classCallCheck(this,select);this.data=opt.data;this.id=opt.id;this.hiddenInputName=opt.hiddenInputName||"test";this.index=-1;this.dom=$("#"+this.id);this.hiddenInput=null;this._init();}_createClass(select,[{key:"_init",value:function _init(){this._addHiddenInput();this._addSelect(this.data);}},{key:"_addHiddenInput",value:function _addHiddenInput(){this.hiddenInput=$("<input type='hidden' name='"+this.hiddenInputName+"'></input>");this.dom.append(this.hiddenInput);}},{key:"_addSelect",value:function _addSelect(data,notSelect){this.index++;var select=$("<select></select>");select.append("<option value=''>请选择</option>");select.data({data:data,index:this.index});var childrenData=[];for(var i=0,l=data.length;i<l;i++){var val=data[i].key,name=data[i].val,selected=data[i].checked=="true",children=data[i].children||[];selected=notSelect?false:selected;if(selected){select.append("<option value='"+val+"' selected>"+name+"</option>");this._setHiddenInputVal(val);childrenData=children;}else{select.append("<option value='"+val+"'>"+name+"</option>");}}this.dom.append(select);this._addEvent(select);if(childrenData.length!=0){this._addSelect(childrenData);}}},{key:"_addEvent",value:function _addEvent(dom){var _this=this;dom.change(function(){var index=$(this).data("index"),data=$(this).data("data"),childrenData=_this._getChildrenData($(this),data),val=$(this).val();_this._setHiddenInputVal(val);_this._selectChange(index,childrenData);});}},{key:"_getChildrenData",value:function _getChildrenData(select,data){var val=select.val(),backData=[];for(var i=0,l=data.length;i<l;i++){var this_data=data[i],this_key=this_data.key,this_val=this_data.val;if(val==this_key){backData=this_data.children||[];break;}}return backData;}},{key:"_delAfterSelect",value:function _delAfterSelect(index){var selects=this.dom.find("select");for(var i=0,l=selects.length;i<l;i++){if(i>index){var this_select=selects.eq(i);this_select.unbind("change").remove();}}}},{key:"_selectChange",value:function _selectChange(index,data){this._delAfterSelect(index);if(data.length!=0){this._addSelect(data,true);}}},{key:"_setHiddenInputVal",value:function _setHiddenInputVal(val){this.hiddenInput.val(val);}}]);return select;}();

//# sourceMappingURL=select_infinite_cascade-compiled.js.map
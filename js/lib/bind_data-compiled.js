"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//TODO 只写了模板赋值单向绑定 双向绑定需要检查this.data对象的key  数据循环未处理
//
//

DEVICE.bindData = function () {
    function bindData(dom, data) {
        _classCallCheck(this, bindData);

        this.dom = dom;
        this.data = data;

        this.mark = {};

        this._init();
    }

    _createClass(bindData, [{
        key: "_init",
        value: function _init() {
            this._getMark(this.dom.get(0));
            this._setVal(this.data);

            console.log(this.mark);
        }

        //解析模板

    }, {
        key: "_getMark",
        value: function _getMark(dom) {

            //处理元素的attr
            var attr = dom.attributes || [];
            for (var i = 0, l = attr.length; i < l; i++) {
                var attr_name = attr[i].name,
                    attr_value = attr[i].value,
                    attr_mark = this._getAllMark(attr_value);

                if (attr_mark.length != 0) {
                    this._saveMark(attr_mark, attr_name, attr_value, dom, "attr");
                }
            }

            //处理元素的text
            var text = dom.nodeValue,
                text_mark = this._getAllMark(text);

            if (text_mark.length != 0) {
                this._saveMark(text_mark, "", text, dom, "text");
            }

            //处理子元素
            var children = dom.childNodes;
            for (var z = 0, zl = children.length; z < zl; z++) {
                if (children[z].nodeType == 1 || children[z].nodeType == 3) {
                    this._getMark(children[z]);
                }
            }
        }

        //读取模板中的{{}}中的变量

    }, {
        key: "_getAllMark",
        value: function _getAllMark(value) {
            if (value === null) {
                return [];
            }

            if (value.indexOf("{{") > -1 && value.indexOf("}}") > -1) {
                return value.match(/\$\w+/ig) || [];
            } else {
                return [];
            }
        }

        //保存模板中的{{}}中的变量

    }, {
        key: "_saveMark",
        value: function _saveMark(array, attr_name, attr_value, dom, type) {
            for (var i = 0, l = array.length; i < l; i++) {
                var key = array[i];
                key = key.substr(1, key.length - 1);

                if (!this.mark[key]) {
                    this.mark[key] = {
                        value: "",
                        items: []
                    };
                }

                this.mark[key].items.push({
                    dom: dom,
                    type: type,
                    attrName: attr_name,
                    value: attr_value
                });
            }
        }

        //赋值

    }, {
        key: "_setVal",
        value: function _setVal(data) {
            for (var key in this.mark) {
                if (this.mark.hasOwnProperty(key)) {
                    var value = data[key] || "",
                        obj = this.mark[key];

                    if (obj.value != value) {
                        obj.value = value;
                        var doms = obj.items;
                        for (var i = 0, l = doms.length; i < l; i++) {
                            var this_data = doms[i],
                                this_dom = this_data.dom,
                                this_attrName = this_data.attrName,
                                oldStr = this_data.value,
                                newStr = this._getNewStr(oldStr, data);

                            if (this_data.type == "attr") {
                                this_dom.setAttribute(this_attrName, newStr);
                            } else {
                                this_dom.nodeValue = newStr;
                            }
                        }
                    }
                }
            }
        }

        //模板字符串转换为实际的字符串

    }, {
        key: "_getNewStr",
        value: function _getNewStr(str, data) {
            str = str.replace(/\{\{[a-z_\$\(][a-z0-9_\.\s\[\]\+\-\*\/\%\$\(\)]*\}\}/ig, function (a) {
                a = a.substr(2, a.length - 4);
                a = a.replace(/\$/g, "data.");
                a = eval(a);
                return a;
            });

            return str;
        }
    }]);

    return bindData;
}();

//# sourceMappingURL=bind_data-compiled.js.map
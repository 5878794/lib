"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//TODO 只写了模板赋值单向绑定 双向绑定需要检查this.data对象的key
//TODO 模板初始显示的{{}}隐藏问题
//

DEVICE.bindData = function () {
    function bindData(dom, data) {
        _classCallCheck(this, bindData);

        this.dom = dom;
        this.data = data;

        this.mark = {};
        this.repeatMark = {};

        this._init();
    }

    _createClass(bindData, [{
        key: "_init",
        value: function _init() {
            this._getMark(this.dom.get(0));
            this.bindData(this.data);
        }
    }, {
        key: "bindData",
        value: function bindData(data) {
            data = JSON.parse(JSON.stringify(data));
            this._setVal(data);
            this._setListVal(data);

            console.log(this.mark);
            console.log(this.repeatMark);
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

            //判断是否是循环模块
            if (dom.dataset && dom.dataset.repeat) {
                this._saveRepeatList(dom);
                return;
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

        //处理循环部分并缓存

    }, {
        key: "_saveRepeatList",
        value: function _saveRepeatList(dom) {
            //获取设置的对象和key
            var text = dom.dataset.repeat;
            text = text.split(" ");

            var data_key = text[3],
                set_key = text[1];

            if (!data_key || !set_key) {
                return;
            }

            //存储

            if (!this.repeatMark[data_key]) {
                this.repeatMark[data_key] = {
                    items: [], //使用该数据源的dom数据列表
                    listNumber: 0, //现有列表数
                    data: [] //现绑定的数据
                };
            }

            this.repeatMark[data_key].items.push({
                dom: dom, //包裹层dom
                list: dom.innerHTML, //要循环的html
                setKey: set_key //html中设置的对象名
            });

            //清空html的模板数据
            $(dom).html("");
        }

        //循环列表类绑定

    }, {
        key: "_setListVal",
        value: function _setListVal(data) {
            for (var key in this.repeatMark) {
                //找到绑定数据的key
                if (this.repeatMark.hasOwnProperty(key)) {
                    var data_source = data[key] || [],
                        data_length = data_source.length,
                        this_item = this.repeatMark[key],
                        items = this_item.items || [],
                        old_number = this_item.listNumber,
                        now_number = data_length,
                        old_data = JSON.stringify(this_item.data),
                        now_data = JSON.stringify(data_source);

                    //数据相同不处理
                    if (old_data == now_data) {
                        continue;
                    }

                    this.repeatMark[key].listNumber = now_number;
                    this.repeatMark[key].data = data_source;

                    //找到绑定该key的所有缓存dom
                    for (var i = 0, l = items.length; i < l; i++) {
                        var _data = items[i],
                            _body = _data.dom,
                            _key = _data.setKey,
                            _html = _data.list;

                        //数据源不同，但条数一样清空dom下的列表，否则按加载下一页
                        if (old_number == now_number) {
                            $(_body).html("");
                        }

                        //生成列表数据
                        for (var z = 0, zl = data_length; z < zl; z++) {
                            var __data = {};
                            __data[_key] = data_source[z];

                            var this_html = this._getNewStr(_html, __data);
                            $(_body).append(this_html);
                        }
                    }
                }
            }
        }
    }]);

    return bindData;
}();

//# sourceMappingURL=bind_data-compiled.js.map
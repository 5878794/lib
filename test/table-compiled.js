"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//自动生成分级表格

//初始化
//var c = new DEVICE.table({
//    id:"test",
//    titleData:[
//        {key:"name",type:"text",width:"50%",name:"目录"},
//        {key:"time",type:"text",width:"30%",name:"时间"},
//        {key:"",type:"btn",width:"20%",name:"操作",children:[
//            {name:"按钮1",onclick:"test1"},
//            {name:"按钮2",onclick:"d.test2"},
//            {name:"增加二级",onclick:"d.add"},
//            {name:"删除",onclick:"d.del"}
//        ]}
//    ],
//    data:[
//        {name:"1-1",time:"2014-11-11",id:1,children:[
//            {name:"2-1",time:"2014-11-11",id:2,children:[]},
//            {name:"2-2",time:"2014-11-11",id:3,children:[
//                {name:"3-1",time:"2014-11-11",id:9,children:[]},
//                {name:"3-2",time:"2014-11-11",id:10,children:[
//                    {name:"3-1",time:"2014-11-11",id:15,children:[]},
//                    {name:"3-2",time:"2014-11-11",id:16,children:[]},
//                    {name:"3-3",time:"2014-11-11",id:17,children:[]}
//                ]},
//                {name:"3-3",time:"2014-11-11",id:11,children:[
//                    {name:"3-1",time:"2014-11-11",id:12,children:[]},
//                    {name:"3-2",time:"2014-11-11",id:13,children:[]},
//                    {name:"3-3",time:"2014-11-11",id:14,children:[]}
//                ]}
//            ]},
//            {name:"2-3",time:"2014-11-11",id:4,children:[
//                {name:"3-1",time:"2014-11-11",id:5,children:[]},
//                {name:"3-2",time:"2014-11-11",id:6,children:[]},
//                {name:"3-3",time:"2014-11-11",id:7,children:[]}
//            ]}
//        ]},
//        {name:"1-2",time:"2014-11-11",id:8,children:[]}
//    ],
//    firstCellPadding:40,
//    firstCellDefultPadding:150
//});

//删除一行
//c.delRow(id);
//id    @param:number       服务器的id

//判断是否有子集
//c.hasChildren(id);
//id    @param:number       服务器的id

//增加第一行
//c.addFirstRow(data);
//data       @param:obj      具体的数据，跟初始数据一样

//增加一行
//c.addRow(parentId,data);
//parentId   @param:number   父级id  服务器的id
//data       @param:obj      具体的数据，跟初始数据一样

//保存数据
//c.saveRow(id,data);
//id         @param:number   数据id  服务器的id
//data       @param:obj      具体的数据，跟初始数据一样

//var d = {};
//var _id = 100;
//var test1 = function(rs){console.log(rs)};
//d.test2 = function(rs){console.log(rs)};
//d.add = function(rs){
//    var id = rs.id,
//        new_id = _id++;
//    c.addRow(id,{name:"3-1",time:"2014-11-11",id:new_id,children:[]})
//};
//d.del = function(rs){
//    var id = rs.id;
//    if(!c.hasChildren(id)){
//        c.delRow(id);
//    }else{
//        alert("有子集")
//    }
//};

if (!window.DEVICE) {
    window.DEVICE = {};
}

DEVICE.table = function () {
    function Table(opt) {
        _classCallCheck(this, Table);

        this.id = opt.id;
        this.data = opt.data;
        this.titleData = opt.titleData;
        this.rowHeight = opt.rowHeight || 30;
        this.firstCellPadding = opt.firstCellPadding || 20;
        this.firstCellDefultPadding = opt.firstCellDefultPadding || 20;
        this.defultShowIndex = opt.defultShowIndex || 2;
        this.indexBg = opt.indexBg || ["#00aceb", "#d9d9d9", "#eeeeee"];
        this.lineColor = opt.lineColor || "#c6c6c6";
        this.titleBottomColor = opt.titleBottomColor || "#333";
        this.rowBottomColor = opt.rowBottomColor || "#ffffff";
        this.dbClickFn = opt.dbClickFn || function () {};

        this.img_jia = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAlklEQVQYV2NUUzVdwMjAoMCAB/xnYHjAqK5qeuDm7dMO+BSqq5pOwFCooGAgANL04MGFDzDNampmDRgKVVRMwKbfuXPmAFaFIJNYWFj1mRkZDEAK/v5nuPDnz++LIJNRTIQoZDFgZoAqZAAp/HMBQyHMGoJWwxQS7RlswQQOHlCA/2dgeM/IyAgPDmTF////F2BkYBAEAIzNV3kphFTVAAAAAElFTkSuQmCC";
        this.img_jian = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAVUlEQVQYV2NkIBIwgtSpq5gU/GVguIBNDzMDg8HNO2cmgBWqqJg43Llz5gA2hTA50hVCTGP8j2nqf0aQbXAT8fkJRSF13QgJHsbz2IPnvyE8eIgJcwCZjzcLe1vIRwAAAABJRU5ErkJggg==";

        this.dom = $("#" + this.id);
        this.body = null;

        this._init();
    }

    _createClass(Table, [{
        key: "_init",
        value: function _init() {
            this._createTitle();
            this._createMainContent();
            this._createList(this.data, this.body, 1, -1);
            this._createCellLines();
            this._addFHEvent();
            this._addMdfEvent();
        }

        //创建包裹层

    }, {
        key: "_createMainContent",
        value: function _createMainContent() {
            this.dom.css({
                position: "relative"
            });
            var div = $("<div></div>");
            div.css({
                position: "absolute",
                left: 0, right: 0, bottom: 0, top: this.rowHeight + "px",
                "overflow-x": "hidden",
                "overflow-y": "scroll"
            });
            this.body = div;
            this.dom.append(div);
        }
        //创建标题行

    }, {
        key: "_createTitle",
        value: function _createTitle() {
            var data = this.titleData,
                row = this._createRow();

            row.css({
                "border-bottom": "1px solid " + this.titleBottomColor,
                "overflow-x": "hidden",
                "overflow-y": "scroll"
            });

            for (var i = 0, l = data.length; i < l; i++) {
                var this_data = data[i],
                    this_div = this._createCell();

                this_div.css({ width: this_data.width }).text(this_data.name);

                row.append(this_div);
            }

            this.dom.append(row);
        }
        //创建数据行

    }, {
        key: "_createList",
        value: function _createList(data, content, index, parentId) {
            for (var i = 0, l = data.length; i < l; i++) {
                //插入行
                var this_data = data[i],
                    row = this._createRow(),
                    body = $("<div></div>"),
                    id = "__table_row_" + this_data.id,
                    isLastRow = i == l - 1,
                    children = this_data.children || [],
                    bodyDisplay = index <= this.defultShowIndex ? "block" : "none",
                    rowBg = this.indexBg[index - 1] || this.indexBg[this.indexBg.length - 1];

                row.attr({ id: id }).data({
                    index: index,
                    serverData: this_data
                }).css({
                    background: rowBg
                });

                //包裹层
                body.attr({
                    id: id + "__",
                    isLastRow: isLastRow
                }).data({
                    isLastRow: isLastRow,
                    parentId: parentId
                }).css({
                    display: bodyDisplay
                }).addClass("____table_row_container__");

                //插入列
                this._createCellDom(this_data, row, index, isLastRow);

                content.append(row).append(body);

                //判断是否有下一层
                if ($.isArray(children) && children.length > 0) {
                    this._createList(children, body, index + 1, id);
                }
            }
        }
        //创建行的dom

    }, {
        key: "_createRow",
        value: function _createRow() {
            var div = $("<div></div>");
            div.css({
                width: "100%",
                height: this.rowHeight + "px",
                "line-height": this.rowHeight + "px",
                background: "#fff",
                color: "#333",
                "text-align": "center"
            }).addClass("____table_row__");
            return div;
        }
        //创建列的dom

    }, {
        key: "_createCell",
        value: function _createCell() {
            var div = $("<p></p>");
            div.css({
                height: this.rowHeight - 1 + "px",
                display: "block",
                float: "left",
                "border-bottom": "1px solid " + this.rowBottomColor
            });
            return div;
        }
        //生成实际的列的dom+数据

    }, {
        key: "_createCellDom",
        value: function _createCellDom(data, dom, index, isLastRow) {
            var title = this.titleData;

            for (var z = 0, zl = title.length; z < zl; z++) {
                var cell = this._createCell(),
                    title_data = title[z],
                    type = title_data.type,
                    key = title_data.key,
                    width = title_data.width,
                    btn = title_data.children;

                cell.css({ width: width }).text(data[key]).attr({ key: key });

                //处理第一列
                if (z == 0) {
                    this._changeCellStyle(cell, index, isLastRow);
                }

                //处理btn列
                if (type == "btn") {
                    this._createCellBtn(cell, btn);
                }

                dom.append(cell);
            }
        }
        //生成每行第一列的样式

    }, {
        key: "_changeCellStyle",
        value: function _changeCellStyle(dom, index, isLastRow) {
            dom.css({
                "text-align": "left",
                position: "relative"
            });

            var text = dom.text(),
                span = $("<span></span>"),
                left = (index - 1) * this.firstCellPadding + this.firstCellDefultPadding;

            span.css({ "padding-left": left + "px" }).text(text).data({
                isLastRow: isLastRow,
                index: index
            });

            dom.addClass("__table_row_p__");
            dom.html("").append(span);
        }
        //生成按钮列的数据

    }, {
        key: "_createCellBtn",
        value: function _createCellBtn(dom, data) {
            var _loop = function _loop(i, l) {
                var this_data = data[i],
                    this_name = this_data.name,
                    this_clickFn = this_data.onclick,
                    clickFn = window;
                this_clickFn = this_clickFn.split(".");

                for (var z = 0, zl = this_clickFn.length; z < zl; z++) {
                    clickFn = clickFn[this_clickFn[z]] || window;
                }

                clickFn = clickFn === window ? function () {} : clickFn;

                var span = $("<span></span>");
                span.css({ padding: "0 5px", cursor: "pointer" }).text(this_name).click(function () {
                    var serverData = dom.parent().data("serverData");
                    clickFn(serverData);
                });

                dom.append(span);
            };

            for (var i = 0, l = data.length; i < l; i++) {
                _loop(i, l);
            }
        }
        //生成每行开头列的竖线

    }, {
        key: "_createCellLines",
        value: function _createCellLines() {
            var container = this.body.find(".____table_row_container__");
            container.data({ isLastRow: false }).attr({ isLastRow: "false" });
            container.each(function () {
                var id = $(this).children(".____table_row__").last().attr("id"),
                    containerId = id + "__";

                $("#" + containerId).data({ isLastRow: true }).attr({ isLastRow: "true" });
            });

            //生成线条
            var doms = this.body.find(".__table_row_p__"),
                _this = this;

            doms.each(function () {
                var span = $(this).find("span"),

                //isLastRow = span.data("isLastRow"),
                index = span.data("index");
                if (index != 1) {
                    _this._createCellLine($(this), index);
                }

                _this._createFh($(this), index);
            });

            //处理每个子集中最后一行的样式
            container.each(function () {
                $(this).children(".____table_row__").last().find(".____table_row_p_line2__").css({ display: "none" });
            });
        }
    }, {
        key: "_createCellLine",
        value: function _createCellLine(dom, index) {
            //生成自身的线条
            var line1 = $("<div class='____table_row_p_line__'></div>"),
                line2 = $("<div class='____table_row_p_line__ ____table_row_p_line2__'></div>"),
                left = (index - 1.6) * this.firstCellPadding + this.firstCellDefultPadding,
                css = {
                width: this.rowHeight / 2 + "px",
                height: this.rowHeight / 2 + "px",
                position: "absolute",
                left: left + "px",
                top: 0
            };

            line1.css(css).css({
                "border-left": "1px solid " + this.lineColor,
                "border-bottom": "1px solid " + this.lineColor
            });

            line2.css(css).css({
                "border-left": "1px solid " + this.lineColor,
                top: this.rowHeight / 2 + "px"
            });

            dom.append(line1).append(line2);

            //生成之前层的线条 竖线
            var content = dom.parent().parent();
            for (var i = index; i > 2; i--) {
                //判断上一层是否是最后一个节点

                if (content.attr("isLastRow") == "true") {
                    content = content.parent();
                    continue;
                }
                content = content.parent();

                var line3 = $("<div class='____table_row_p_line__'></div>"),
                    left1 = (i - 2.6) * this.firstCellPadding + this.firstCellDefultPadding;
                line3.css(css).css({
                    "border-left": "1px solid " + this.lineColor,
                    left: left1 + "px",
                    height: this.rowHeight + "px"
                });

                dom.append(line3);
            }
        }
        //删除每行开头列的竖线

    }, {
        key: "_delCellLines",
        value: function _delCellLines() {
            var doms = this.body.find(".____table_row_p_line__"),
                fh = this.body.find(".____table_row_fh____");

            fh.unbind("click");
            doms.remove();
            fh.remove();
        }
        //添加每行开头有子集的  展开、合拢  按钮

    }, {
        key: "_createFh",
        value: function _createFh(dom, index) {
            var row_id = dom.parent().attr("id"),
                content_id = row_id + "__",
                content = $("#" + content_id),
                hasChildren = content.find("div").length > 0,
                isHidden = content.css("display") == "none",
                bgSrc = isHidden ? this.img_jia : this.img_jian;

            if (!hasChildren) {
                return;
            }

            var fh = $("<div class='____table_row_fh____'></div>"),
                left = (index - 1.6) * this.firstCellPadding + this.firstCellDefultPadding;

            if (index == 1) {
                left = left + 25;
            }

            fh.css({
                width: "10px", height: "10px",
                position: "absolute",
                top: this.rowHeight / 2 - 5 + "px",
                left: left - 15 + "px",
                cursor: "pointer",
                background: "url(" + bgSrc + ")"
            }).data({
                content: content,
                isHidden: isHidden
            });

            dom.append(fh);
        }
        //添加事件

    }, {
        key: "_addFHEvent",
        value: function _addFHEvent() {
            var fh = this.body.find(".____table_row_fh____"),
                _this = this;

            //展开、收拢图标点击
            fh.click(function () {
                var dom = $(this).data("content"),
                    isHidden = $(this).data("isHidden");

                if (isHidden) {
                    dom.css({ display: "block" });
                    $(this).data({ isHidden: false }).css({
                        background: "url(" + _this.img_jian + ")"
                    });
                } else {
                    dom.css({ display: "none" });
                    $(this).data({ isHidden: true }).css({
                        background: "url(" + _this.img_jia + ")"
                    });
                }
            });
        }
        //刷新每行开头列的竖线

    }, {
        key: "_refresh",
        value: function _refresh() {
            this._delCellLines();
            this._createCellLines();
            this._addFHEvent();
        }
        //删除

    }, {
        key: "delRow",
        value: function delRow(id) {
            id = "__table_row_" + id;
            var childrenContainer = $("#" + id + "__"),
                row = $("#" + id);

            childrenContainer.remove();
            row.remove();

            this._refresh();
        }
        //判断是否有子集

    }, {
        key: "hasChildren",
        value: function hasChildren(id) {
            id = "__table_row_" + id;
            var childrenContainer = $("#" + id + "__");
            return childrenContainer.find("div").length != 0;
        }
        //增加行

    }, {
        key: "addRow",
        value: function addRow(parentId, data) {
            var id = "__table_row_" + parentId;
            var container = $("#" + id + "__"),
                row = $("#" + id),
                index = row.data("index") + 1;

            this._createList([data], container, index, id);
            this._refresh();

            var btn = row.find(".____table_row_fh____"),
                isHidden = btn.data("isHidden");

            if (isHidden) {
                btn.trigger("click");
            }
        }
        //保存数据

    }, {
        key: "saveRow",
        value: function saveRow(id, data) {
            var _id = "__table_row_" + id,
                row = $("#" + _id);

            row.find("p").each(function () {
                var key = $(this).attr("key");
                if (key && data[key]) {
                    if ($(this).find("span").length > 0) {
                        $(this).find("span").text(data[key]);
                    } else {
                        $(this).text(data[key]);
                    }
                }
            });
        }
        //双击执行

    }, {
        key: "_addMdfEvent",
        value: function _addMdfEvent() {
            var _this = this;

            this.body.find(".____table_row__").dblclick(function () {
                var data = $(this).data("serverData");
                _this.dbClickFn(data);
            });
        }
        //增加第一级

    }, {
        key: "addFirstRow",
        value: function addFirstRow(data) {
            var container = this.body,
                index = 1;

            this._createList([data], container, index, -1);
            this._refresh();
        }
    }]);

    return Table;
}();

//# sourceMappingURL=table-compiled.js.map
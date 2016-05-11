//自动生成分级表格



if(!window.DEVICE){window.DEVICE={};}

DEVICE.table = class Table{
    constructor(opt){
        this.id = opt.id;
        this.data = opt.data;
        this.titleData = opt.titleData;
        this.rowHeight = opt.rowHeight || 30;
        this.firstCellPadding = opt.firstCellPadding || 20;
        this.firstCellDefultPadding = opt.firstCellDefultPadding || 20;
        this.defultShowIndex = opt.defultShowIndex || 2;
        this.indexBg = opt.indexBg || ["red","yellow","#eee","#fff"];
        this.lineColor = opt.lineColor || "blue";
        this.titleBottomColor = opt.titleBottomColor || "#333";
        this.rowBottomColor = opt.rowBottomColor || "red";

        this.img_jia = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAlklEQVQYV2NUUzVdwMjAoMCAB/xnYHjAqK5qeuDm7dMO+BSqq5pOwFCooGAgANL04MGFDzDNampmDRgKVVRMwKbfuXPmAFaFIJNYWFj1mRkZDEAK/v5nuPDnz++LIJNRTIQoZDFgZoAqZAAp/HMBQyHMGoJWwxQS7RlswQQOHlCA/2dgeM/IyAgPDmTF////F2BkYBAEAIzNV3kphFTVAAAAAElFTkSuQmCC";
        this.img_jian = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAVUlEQVQYV2NkIBIwgtSpq5gU/GVguIBNDzMDg8HNO2cmgBWqqJg43Llz5gA2hTA50hVCTGP8j2nqf0aQbXAT8fkJRSF13QgJHsbz2IPnvyE8eIgJcwCZjzcLe1vIRwAAAABJRU5ErkJggg==";

        this.dom = $("#"+this.id);
        this.body = null;

        this._init();
    }

    _init(){
        this._createMainContent();
        this._createTitle();
        this._createList(this.data,this.body,1,-1);
        this._createCellLines();
        this._addEvent();
    }

    //创建包裹层
    _createMainContent(){
        this.dom.css({
            position:"relative"
        });
        var div = $("<div></div>");
        div.css({
            position:"absolute",
            left:0,right:0,bottom:0,top:this.rowHeight+"px",
            "overflow-x":"hidden",
            "overflow-y":"scroll"
        });
        this.body = div;
        this.dom.append(div);
    }
    //创建标题行
    _createTitle(){
        let data = this.titleData,
            row = this._createRow();

        row.css({
            "border-bottom":"1px solid "+this.titleBottomColor,
            "overflow-x":"hidden",
            "overflow-y":"scroll"
        });

        for(let i=0,l=data.length;i<l;i++){
            let this_data = data[i],
                this_div = this._createCell();

            this_div.css({width:this_data.width})
                    .text(this_data.name);

            row.append(this_div);
        }

        this.dom.append(row);

    }
    //创建数据行
    _createList(data,content,index,parentId){
        for(let i=0,l=data.length;i<l;i++){
            //插入行
            let this_data = data[i],
                row = this._createRow(),
                body = $("<div></div>"),
                id = "__table_row_"+this_data.id,
                isLastRow = (i==l-1),
                children = this_data.children || [],
                bodyDisplay = (index <= this.defultShowIndex)? "display" : "none",
                rowBg = this.indexBg[index-1] || "#fff";

            row.attr({id:id})
                .data({
                    serverData:this_data
                })
                .css({
                    background:rowBg
                });



            //包裹层
            body.attr({
                id:id+"__"
            }).data({
                isLastRow:isLastRow,
                parentId:parentId
            }).css({
                display:bodyDisplay
            });

            //插入列
            this._createCellDom(this_data,row,index,isLastRow);

            content.append(row)
                   .append(body);


            //判断是否有下一层
            if($.isArray(children) && children.length > 0){
                this._createList(children,body,index+1,id+"__");
            }
        }

    }
    //创建行的dom
    _createRow(){
        let div = $("<div></div>");
        div.css({
            width:"100%",
            height:this.rowHeight+"px",
            "line-height":this.rowHeight+"px",
            background:"#fff",
            color:"#333",
            "text-align":"center"
        });
        return div;
    }
    //创建列的dom
    _createCell(){
        let div = $("<p></p>");
        div.css({
            height:this.rowHeight-1+"px",
            display:"block",
            float:"left",
            "border-bottom":"1px solid "+this.rowBottomColor
        });
        return div;
    }
    //生成实际的列的dom+数据
    _createCellDom(data,dom,index,isLastRow){
        let title = this.titleData;

        for(let z=0,zl=title.length;z<zl;z++){
            let cell = this._createCell(),
                title_data = title[z],
                type = title_data.type,
                key = title_data.key,
                width = title_data.width,
                btn = title_data.children;

            cell.css({width:width})
                .text(data[key]);

            //处理第一列
            if(z==0){
                this._changeCellStyle(cell,index,isLastRow);
            }

            //处理btn列
            if(type=="btn"){
                this._createCellBtn(cell,btn);
            }

           dom.append(cell);
        }
    }
    //生成每行第一列的样式
    _changeCellStyle(dom,index,isLastRow){
        dom.css({
            "text-align":"left",
            position:"relative"
        });

        let text = dom.text(),
            span = $("<span></span>"),
            left = (index-1)*this.firstCellPadding + this.firstCellDefultPadding;


        span.css({"padding-left":left+"px"})
            .text(text)
            .data({
                isLastRow:isLastRow,
                index:index
            });

        dom.addClass("__table_row_p__");
        dom.html("").append(span);



    }
    //生成按钮列的数据
    _createCellBtn(dom,data){
        for(let i=0,l=data.length;i<l;i++){
            let this_data = data[i],
                this_name = this_data.name,
                this_clickFn = this_data.onclick,
                clickFn = window;
            this_clickFn = this_clickFn.split(".");

            for(let z=0,zl=this_clickFn.length;z<zl;z++){
                clickFn = clickFn[this_clickFn[z]] || window;
            }

            clickFn = (clickFn === window)? function(){} : clickFn;

            let span = $("<span></span>");
            span.css({padding:"0 5px",cursor:"pointer"})
                .text(this_name)
                .click(function(){
                    var serverData = dom.parent().data("serverData");
                    clickFn(serverData);
                });

            dom.append(span);
        }
    }
    //生成每行开头列的竖线
    _createCellLines(){
        var doms = this.body.find(".__table_row_p__"),
            _this = this;

        doms.each(function(){
            let span = $(this).find("span"),
                isLastRow = span.data("isLastRow"),
                index = span.data("index");
            if(index!=1){
                _this._createCellLine($(this),index,isLastRow);
            }

            _this._createFh($(this),index);

        });
    }
    _createCellLine(dom,index,isLastRow){
        //生成自身的线条
        let line1 = $("<div class='____table_row_p_line__'></div>"),
            line2 = $("<div class='____table_row_p_line__'></div>"),
            left = (index-1.6)*this.firstCellPadding+this.firstCellDefultPadding,
            css = {
                width:this.rowHeight/2+"px",
                height:this.rowHeight/2+"px",
                position:"absolute",
                left:left+"px",
                top:0
            };

        line1.css(css).css({
            "border-left":"1px solid "+this.lineColor,
            "border-bottom":"1px solid "+this.lineColor
        });



        if(!isLastRow){
            line2.css(css).css({
                "border-left":"1px solid "+this.lineColor,
                top:this.rowHeight/2+"px"
            });
        }

        dom.append(line1).append(line2);


        //生成之前层的线条 竖线
        let content = dom.parent().parent();
        for(let i=index;i>2;i--){
            //判断上一层是否是最后一个节点
            if(content.data("isLastRow")){
                content = content.parent();
                continue;
            }

            let line3 = $("<div class='____table_row_p_line__'></div>"),
                left1 = (i-2.6)*this.firstCellPadding+this.firstCellDefultPadding;
            line3.css(css).css({
                "border-left":"1px solid "+this.lineColor,
                left:left1+"px",
                height:this.rowHeight+"px"
            });

            dom.append(line3);
        }
    }
    //添加每行开头有子集的  展开、合拢  按钮
    _createFh(dom,index){
        let row_id = dom.parent().attr("id"),
            content_id = row_id+"__",
            content = $("#"+content_id),
            hasChildren = (content.find("div").length > 0),
            isHidden = (content.css("display") == "none"),
            bgSrc = (isHidden)? this.img_jia : this.img_jian;

        if(!hasChildren){return;}

        let fh = $("<div class='____table_row_fh____'></div>"),
            left = (index-1.6)*this.firstCellPadding+this.firstCellDefultPadding;

        if(index == 1){
            left = left + 25;
        }

        fh.css({
            width:"10px",height:"10px",
            position:"absolute",
            top:this.rowHeight/2-5+"px",
            left:left-15+"px",
            cursor:"pointer",
            background:"url("+bgSrc+")"
        }).data({
            content:content,
            isHidden:isHidden
        });


        dom.append(fh);
    }
    //添加事件
    _addEvent(){
        var fh = this.body.find(".____table_row_fh____"),
            _this = this;


        //展开、收拢图标点击
        fh.click(function(){
            let dom = $(this).data("content"),
                isHidden = $(this).data("isHidden");

            if(isHidden){
                dom.css({display:"block"});
                $(this).data({isHidden:false}).css({
                    background:"url("+_this.img_jian+")"
                });
            }else{
                dom.css({display:"none"});
                $(this).data({isHidden:true}).css({
                    background:"url("+_this.img_jia+")"
                });
            }
        });
    }
};



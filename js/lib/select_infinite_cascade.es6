
//无限级联select
//数据格式见下面注释的模拟数据
//new DEVICE.infiniteCascadeSelect({
//    id:"test",                //要插入的dom的id
//    data:selectData,          //数据源
//    hiddenInputName:"aaa"     //获取数据的input的name
//})



DEVICE.infiniteCascadeSelect = class select{
    constructor(opt){
        this.data = opt.data;
        this.id = opt.id;
        this.hiddenInputName = opt.hiddenInputName || "test";

        this.index = -1;
        this.dom = $("#"+this.id);
        this.hiddenInput = null;
        this._init();
    }

    _init(){
        this._addHiddenInput();
        this._addSelect(this.data);
    }

    //增加隐藏input  取值用
    _addHiddenInput(){
        this.hiddenInput = $("<input type='hidden' name='"+this.hiddenInputName+"'></input>");
        this.dom.append(this.hiddenInput);
    }

    //在最后创建一个select
    _addSelect(data,notSelect){
        this.index++;

        var select = $("<select></select>");

        select.append("<option value=''>请选择</option>");
        select.data({data:data,index:this.index});

        let childrenData = [];

        for(let i=0,l=data.length;i<l;i++){
            let val = data[i].key,
                name = data[i].val,
                selected = (data[i].checked == "true"),
                children = data[i].children || [];

            selected = (notSelect)? false : selected;

            if(selected){
                select.append("<option value='"+val+"' selected>"+name+"</option>");
                this._setHiddenInputVal(val);
                childrenData = children;
            }else{
                select.append("<option value='"+val+"'>"+name+"</option>");
            }
        }

        this.dom.append(select);
        this._addEvent(select);

        if(childrenData.length !=0){
            this._addSelect(childrenData);
        }
    }

    //事件监听
    _addEvent(dom){
        var _this = this;

        dom.change(function(){
            let index = $(this).data("index"),
                data = $(this).data("data"),
                childrenData = _this._getChildrenData($(this),data),
                val = $(this).val();

            _this._setHiddenInputVal(val);
            _this._selectChange(index,childrenData);
        })
    }


    //获取当前select的子集
    _getChildrenData(select,data){
        let val = select.val(),
            backData = [];

        for(let i=0,l=data.length;i<l;i++){
            let this_data = data[i],
                this_key = this_data.key,
                this_val = this_data.val;

            if(val == this_key){
                backData = this_data.children || [];
                break;
            }
        }
        return backData;
    }

    //删除该元素后的select
    _delAfterSelect(index){
        let selects = this.dom.find("select");
        for(let i=0,l=selects.length;i<l;i++){
            if(i>index){
                let this_select = selects.eq(i);
                this_select.unbind("change")
                           .remove();
            }
        }
    }

    //change事件处理
    _selectChange(index,data){
        this._delAfterSelect(index);
        if(data.length !=0){
            this._addSelect(data,true);
        }
    }

    //设置隐藏input的val
    _setHiddenInputVal(val){
        this.hiddenInput.val(val);
    }
};



//
//var selectData = [
//    {
//        key:"22",
//        val:"22",
//        checked:"true",
//        children:[
//            {
//                checked:"false",
//                key:"2211",
//                val:"2211"
//            },
//            {
//                checked:"true",
//                key:"2212",
//                val:"2212",
//                children:[
//                    {
//                        checked:"false",
//                        key:"2213",
//                        val:"2213",
//                        children:[
//                            {
//                                checked:"false",
//                                key:"2214",
//                                val:"2214",
//                                children:[
//                                    {
//                                        checked:"false",
//                                        key:"2215",
//                                        val:"2215"
//                                    }
//                                ]
//                            },
//                            {
//                                checked:"false",
//                                key:"2211",
//                                val:"2211"
//                            }
//                        ]
//                    },
//                    {
//                        checked:"false",
//                        key:"2223",
//                        val:"2211"
//                    },
//                ]
//            },
//            {
//                checked:"false",
//                key:"2213",
//                val:"2213"
//            }]
//    },
//    {
//        key:"33",
//        val:"33",
//        checked:"false",
//        children:[{
//            checked:"false",
//            key:"3311",
//            val:"3311"
//        }]
//    }
//];
//
//var dd;
//$(document).ready(function(){
//    dd = new DEVICE.infiniteCascadeSelect({
//        id:"test",
//        data:selectData,
//        hiddenInputName:"aaa"
//    })
//});
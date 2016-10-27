


//TODO 只写了模板赋值单向绑定 双向绑定需要检查this.data对象的key  数据循环未处理
//


DEVICE.bindData = class bindData{
    constructor(dom,data){
        this.dom = dom;
        this.data = data;

        this.mark = {};

        this._init();
    }

    _init(){
        this._getMark(this.dom.get(0));
        this._setVal(this.data);

        console.log(this.mark)
    }

    //解析模板
    _getMark(dom){
        //if(dom.length == 0){return;}

        //处理元素的attr
        let attr = dom.attributes || [];
        for(var i=0,l=attr.length;i<l;i++){
            let attr_name = attr[i].name,
                attr_value = attr[i].value,
                attr_mark = this._getAllMark(attr_value);

            if(attr_mark.length != 0 ){
                this._saveMark(attr_mark,attr_name,attr_value,dom,"attr")
            }
        }

        //处理元素的text
        let text = dom.nodeValue,
            text_mark = this._getAllMark(text);

        if(text_mark.length != 0 ){
            this._saveMark(text_mark,"",text,dom,"text")
        }



        //处理子元素
        let children = dom.childNodes;
        for(var z=0,zl=children.length;z<zl;z++){
            this._getMark(children[z])
        }
    }

    //读取模板中的{{}}中的变量
    _getAllMark(value){
        if(value === null){return []}

        if(value.indexOf("{{")>-1 && value.indexOf("}}")>-1){
            return value.match(/\$\w+/ig);
        }else{
            return [];
        }
    }

    //保存模板中的{{}}中的变量
    _saveMark(array,attr_name,attr_value,dom,type){
        for(var i =0 , l = array.length; i<l; i++){
            let key = array[i];
            key = key.substr(1,key.length-1);

            if(!this.mark[key]){
                this.mark[key] = {
                    value:"",
                    items:[]
                };
            }

            this.mark[key].items.push({
                dom:dom,
                type:type,
                attrName:attr_name,
                value:attr_value
            })

        }
    }

    //赋值
    _setVal(data){
        for(var key in this.mark){
            if(this.mark.hasOwnProperty(key)){
                let value = data[key] || "",
                    obj = this.mark[key];

                if(obj.value != value){
                    obj.value = value;
                    let doms = obj.items;
                    for(var i=0,l=doms.length;i<l;i++){
                        let this_data = doms[i],
                            this_dom = this_data.dom,
                            this_attrName = this_data.attrName,
                            oldStr = this_data.value,
                            newStr = this._getNewStr(oldStr,data);

                        if(this_data.type=="attr"){
                            this_dom.setAttribute(this_attrName,newStr);
                        }else{
                            this_dom.nodeValue = newStr;
                        }
                    }
                }
            }
        }
    }

    //模板字符串转换为实际的字符串
    _getNewStr(str,data){
        str = str.replace(/\{\{[a-z_\$\(][a-z0-9_\.\s\[\]\+\-\*\/\%\$\(\)]*\}\}/ig,function(a){
            a = a.substr(2,a.length-4);
            a = a.replace(/\$/g,"data.");
            a = eval(a);
            return a;
        });

        return str;
    }
};



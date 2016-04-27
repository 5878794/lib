/**
 * Created by beens on 16/4/27.
 */


//input记住密码等（保存input的值到localStorage）
//支持 input，textarea，passwprd，select，单个checkbox
//依赖 local_data.js


//保存id为input的值
//DEVICE.rememberInputVal.saveVal(["id1","id2","id3"]);
//初始化显示id为input的值
//DEVICE.rememberInputVal.showVal(["id1","id2","id3"]);
//删除id为input的保存值
//DEVICE.rememberInputVal.delVal(["id1","id2","id3"]);


DEVICE.rememberInputVal = {
    saveVal:function(ids){
        ids = ids || [];
        var data = this._getVal();

        for(var i= 0,l=ids.length;i<l;i++){
            var this_id = ids[i],
                dom = $("#"+this_id),
                type = dom.attr("type"),
                val = dom.val();

            if(type == "checkbox"){
                val = dom.get(0).checked;
            }

            data[this_id] = {
                type : type,
                val : val
            };
        }

        DEVICE.localData.setItem("rememberInputVal",JSON.stringify(data));
    },
    showVal:function(ids){
        ids = ids || [];
        var data = this._getVal();


        for(var i= 0,l=ids.length;i<l;i++){
            var this_id = ids[i],
                dom = $("#"+this_id),
                this_data = data[this_id] || {},
                val = this_data.val;

            if(this_data.type == "checkbox"){
                dom.get(0).checked = (val)? true : false;
            }else{
                if(val){
                    dom.val(val);
                }
            }
        }
    },
    delVal:function(ids){
        ids = ids || [];
        var data = this._getVal();


        for(var i= 0,l=ids.length;i<l;i++){
            var this_id = ids[i];
            delete data[this_id];
        }

        DEVICE.localData.setItem("rememberInputVal",JSON.stringify(data));
    },
    _getVal:function(){
        var str = DEVICE.localData.getItem("rememberInputVal") || "{}";
        return JSON.parse(str);
    }
};
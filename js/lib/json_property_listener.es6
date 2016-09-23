
//对象参数变更监听，对象（dom和json）/数组



//var a = {a:1,b:2};
//a.keyChange(   //对象添加监听
//  a,           //监听a对象下的  key:a
//  function(){console.log("change")   //当a.a的值变更的时候触发的函数
//});
//a.a=123;


//注意：对象下不要  key  和 ___key___  同时存在


Object.prototype.keyChange = function(key,callback){
    var  _key = "___"+key+"___";

    this[_key] = this[key];

    Object.defineProperty(this,key,{
        configurable:true,
        get:function(){
            return this[_key];
        },
        set:function(value){
            if(this[_key] != value){
                this[_key] = value;
                callback();
            }
        }
    })
};





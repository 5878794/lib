
//自动绑定数据
//$.fn.createList(data,cloneId)
//插入到指定对象内的数据
//{}内为eval部分
//html中需要指定data中的数据以$开头









//html部分   display:none  写在html上不要写在css内
//<div id="test123" style="display: none;">
//    <div>{$a*100}</div>
//    <div>{$b+$g.a*3-3}</div>
//    <div>{$c*1}</div>
//    <div>{$d-2}</div>
//    <div>{parseInt($e/3)}</div>
//    <div>{aa($f%3)}</div>
//</div>


//<script>部分
//abc = {
//    a:1,
//    b:2,
//    c:3,
//    d:4,
//    e:5,
//    f:6,
//    g:{
//        a:22
//    }
//};
//var aa = function(val){
//        return 123;
//    }
//</script>

//运行。。。。。。
//$("body").createList(abc,"test123")


//输出
//<div id="">
    //<div>100</div>
    //<div>65</div>
    //<div>3</div>
    //<div>2</div>
    //<div>1</div>
    //<div>123</div>
//</div>



$.fn.createList = function(data,cloneId){

    let list = $("#"+cloneId).clone().css({display:""}).attr({id:""}),
        html = list.prop("outerHTML"),
        text = [];

    data = ($.isArray(data))? data : [data];


    for(var i = 0,l = data.length; i<l;i++){
        let this_data = data[i];

        let newStr = html.replace(/\{[a-z_\$\(][a-z0-9_\.\s\[\]\+\-\*\/\%\$\(\)]*\}/ig,function(a){
            a = a.substr(1,a.length-2);
            a = a.replace(/\$/g,"this_data.");
            a = eval(a);
            return a;
        });

        text.push(newStr);
    }

    let htmls = text.join(""),
        doms = $(htmls);

    $(this).append(doms);
};



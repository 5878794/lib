/**
 * Created by bens on 16-2-29.
 */



//单向数据绑定
//循环的需要数据循环，克隆对象进行绑定  未测试

//html模板
//{}内为eval的部分
//$为变量的属性
//var a = $("<div id='{$Abc[0].a*3}'>{fff($Abc[0].ab)+fff($Abc[0].a,$Abc[0].ab+$Abc[0].ab)}</div>");


//$("#test").bindData(data);
//最终返回html字符串
//data为json对象不能是数组



//eg:
//data = [{a:1,b:1},{a:2,b:2},{a:3,b:3},{a:4,b:4}]
//var dom = $("<div id='{$a}'>{$b}</div>")
//for(var i=0,l=data.length;i<l;i++){
//	var this_data = data[i],
//		this_dom = dom.clone();
//
//	html = this_dom.bindDataBackHtml(this_data);
//	$("body").append(html)
//}


$.fn.bindDataBackHtml = function(data){
	var html = $(this).prop("outerHTML"),
		text = [];

	//获取{}内的内容
	html = html.split(/\{|\}/g);

	for(var i= 0,l=html.length;i<l;i++){
		if(i%2 == 1){
			//处理变量及运算
			var str = html[i];
			str = str.replace(/\$[a-z_][a-z0-9_\.\s\[\]]*/ig,function(match){
				return match.replace(/\$/g,"data.");
			});
			str = eval(str);
			text.push(str);

		}else{
			text.push(html[i]);
		}
	}

	return text.join("");
};

//var data = {
//	Abc:[{
//		a:3,
//		ab:2
//	}]
//};
//var fff = function(a){
//	return a+123;
//};
//var a = $("<div id='{$Abc[0].a*3}'>{fff($Abc[0].ab)+fff($Abc[0].a,$Abc[0].ab+$Abc[0].ab)}</div>");
//console.log(a.bindData(data));





//其他测试
//监听json变化  只能监听最后一层
//if(!Object.prototype.bind){
//
//	Object.prototype.bind = function(key, callback){
//		var _key = "_" + key;
//
//		Object.defineProperty(this, key, {
//			get: function(){
//				return this[_key];
//			},
//
//			set: function(value){
//				if(value !== this[_key]){
//					this[_key] = value;
//					callback();
//				}
//			}
//		});
//	}
//}
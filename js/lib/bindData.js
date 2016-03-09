/**
 * Created by bens on 16-2-29.
 */


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



$.fn.bindData = function(data){
	var html = $(this).prop("outerHTML");

	html = html.split(/\{|\}/g);

	var text = [];

	for(var i= 0,l=html.length;i<l;i++){
		if(i%2 == 1){
			var str = html[i],
				param = str.match(/[a-zA-Z_][a-zA-Z0-9._\s\[\]]*[a-zA-Z0-9_\]]?/g) || [];
console.log(param)
			for(var z= 0,zl=param.length;z<zl;z++){
				var this_param = param[z].replace(/\s*/g,"");
				this_param = "data."+this_param;
				var change_str = param[z].replace(/\[/g,"\\[").replace(/\]/g,"\\]");
				var reg = new RegExp(change_str,"g");
				str = str.replace(reg,this_param);
			}
			str = eval(str);
			text.push(str);
		}else{
			text.push(html[i]);
		}
	}

	return text.join("");
	//console.log(text.join(""))
};

var data = {
	abc:[{
		a:3,
		ab:2
	}]
};
var fff = function(a){
	return a+123;
};
var a = $("<div id='{abc[0].a*3}'>{fn(abc[0].ab)}</div>");
console.log(a.bindData(data));
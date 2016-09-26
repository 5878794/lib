/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-8-5
 * Time: 上午10:56
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */

var __a__;

$(document).ready(function(){
	var scripts = $("script");

	scripts.each(function(){
		var id = $(this).attr("id"),
			message = $(this).attr("message"),
			yl = $(this).attr("yl") || "";

		if(id){
			if(id == "device" || id == "jq_plus" ){

			}else{
				$("body").append('<label><input id="__'+id+'__" yl="'+yl+'" type="checkbox" value="'+id+'" name="box">'+id + '<span style="color:#999">('+message+')</span>'+'</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class="__look__" _id="'+id+'" style="color:red;cursor:pointer;">查看</a><br/>');
			}
		}
	});



	var a = $("<a>下载</a>");
	a.css({
		"text-align":"center",
		height:"30px",
		"line-height":"30px",
		width:"100%",
		background:"#eee",
		display:"block"
	});
	$("body").append(a);
	__a__ = a;


	$("label").find("input").click(function(e){
		//e.stopPropagation();
		//e.preventDefault();
		download();
	});
	$(".__look__").click(function(){
		var id = $(this).attr("_id");
		showFileInfo(id);
	});
});


var getParamFromUrl = function(param){
	var find_val = "";

	var search = window.location.search;
	search = search.substr(1);
	var searchs = search.split("&");

	for( var i= 0,l=searchs.length;i<l;i++){
		var this_val =  searchs[i],
			this_keys = this_val.split("="),
			this_key = this_keys[0];

		if(this_key == param){
			find_val = this_keys[1];
			break;
		}
	}
	return decodeURI(find_val);

};



//var getScriptText = function(id){
//	var src = $("#"+id).attr("src");
//
//	var text = "";
//
//	$.ajax({
//		type:"get",
//		contentType:'application/json;charset="UTF-8"',
//		async:false,
//		cache:false,
//		url:src,   //文件地址
//		dataType:"script",
//		success:function(data){
//			text = data;
//		},
//		error:function(){
//			console.log("加载失败！");
//		}
//	});
//
//
//	return text;
//
//};


var download = function(){
	var choose = $("input"),
		select = {};
	choose.each(function(){
		if(this.checked){
			var yl = $(this).attr("yl") || "";
			if(yl){
				yl = yl.split(",");
				for(var z= 0,zl=yl.length;z<zl;z++){
					var this_yl = yl[z];
					select[this_yl] = true;
					$("#__"+this_yl+"__").get(0).checked = true;
				}
			}
			select[$(this).val()] = true;
		}
	});

	var _select = [];
	for(var key in select){
		if(select.hasOwnProperty(key)){
			_select.push(key);
		}
	}

	select = _select;
	var select_text = select.join("\r\n")+"\r\n";
	select_text = "/*\r\n"+select_text+"*/\r\n";


	var jsFiles = [];
	jsFiles.push("device");
	jsFiles.push("jq_plus");
	for(var i= 0,l=select.length;i<l;i++){
		jsFiles.push(select[i]);
	}


	getFilesText(jsFiles,function(texts){
		texts = select_text + texts;
		//去注释 换行
		if(getParamFromUrl("zip")){
			var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g;
			texts = texts.replace(reg, function(word) { // 去除注释后的文本
				return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word;
			});
			texts = texts.replace(/\n|\r|\t/g,"");
		}


		var blob = new Blob([texts]);
		var src= window.URL.createObjectURL(blob);

		__a__.attr({href:src});
		__a__.get(0).download = "lib.js";
	});


	//var texts = [];
	//var lib = getScriptText("device"),
	//	jq_plus = getScriptText("jq_plus");
	//texts.push(select_text);
	//texts.push(lib);
	//texts.push(jq_plus);
    //
	//for(var i= 0,l=select.length;i<l;i++){
	//	var text = getScriptText(select[i]);
	//	texts.push(text);
	//}
    //
	//texts = texts.join("");



};


var getFilesText = function(files,callback){
	var texts = [];

console.log(files)
	var runer = function(){
		if(files.length==0){
			callback(texts.join(""));
		}else{
			var _id = files.shift();
			ajax(_id);
		}
	};





	var ajax = function(id){
		var src = "http://"+window.location.host + "/"+$("#"+id).attr("src");
console.log(src);
		//var text = "";

		XMLHttpRequest.prototype.onsend = function(data) {
			//if(isValidUrl(this.url)) {
				this.setRequestHeader("X-Requested-With", "XMLHttpRequest")
				//this.setRequestHeader(token_name, token_value);
			//}
		};


		$.ajax({
			type:"get",
			contentType:'application/json;charset="UTF-8"',
			cache:false,
			url:src,   //文件地址
			//dataType:"script",
			success:function(data){
				//text = data;
				texts.push(data);
				runer();
			},
			error:function(){
				//alert(id+" 加载失败");
				console.log("加载失败！"+id);
				runer();
			}
		});


	};


	runer();
	//return text;
};



var showFileInfo = function(id){

	getFilesText([id],function(text){
		//var text = getScriptText(id);
		var blob = new Blob([text]);
		var src= window.URL.createObjectURL(blob);
		window.open(src);
	});
};
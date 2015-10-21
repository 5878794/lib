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


	$("label").click(function(){
		download();
	});
	$(".__look__").click(function(){
		var id = $(this).attr("_id");
		showFileInfo(id);
	});
});


var getScriptText = function(id){
	var src = $("#"+id).attr("src");

	var text = "";

	$.ajax({
		type:"get",
		contentType:'application/json;charset="UTF-8"',
		async:false,
		cache:false,
		url:src,   //文件地址
		dataType:"script",
		success:function(data){
			text = data;
		},
		error:function(){
			console.log("加载失败！");
		}
	});


	return text;

};


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


	var texts = [];
	var lib = getScriptText("device"),
		jq_plus = getScriptText("jq_plus");
	texts.push(select_text);
	texts.push(lib);
	texts.push(jq_plus);

	for(var i= 0,l=select.length;i<l;i++){
		var text = getScriptText(select[i]);
		texts.push(text);
	}

	texts = texts.join("");

	var blob = new Blob([texts]);
	var src= window.URL.createObjectURL(blob);

	__a__.attr({href:src});
	__a__.get(0).download = "lib.js";
};


var showFileInfo = function(id){
	var text = getScriptText(id);
	var blob = new Blob([text]);
	var src= window.URL.createObjectURL(blob);
	window.open(src);
};
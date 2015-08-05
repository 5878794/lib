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
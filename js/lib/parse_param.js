/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-8-6
 * Time: 上午11:37
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */



//将json对象转换为地址栏参数形式
//DEVICE.parseParam({a:1,b:2});
DEVICE.parseParam = function(obj){
	var fn = function(param,key){
		var paramStr="";
		if(param instanceof String||param instanceof Number||param instanceof Boolean){
			paramStr+="&"+key+"="+encodeURIComponent(param);
		}else{
			$.each(param,function(i){
				var k=key==null?i:key+(param instanceof Array?"["+i+"]":"."+i);
				paramStr+='&'+fn(this, k);
			});
		}
		return paramStr.substr(1);
	};

	return fn(obj);
};
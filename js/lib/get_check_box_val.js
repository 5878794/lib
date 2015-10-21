/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-8-6
 * Time: 上午11:26
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */



//获取checkbox的选中值
DEVICE.getCheckboxVal = function(name){
	var objs = $("input[name='"+name+"']"),
		vals = [];

	objs.each(function(){
		if(this.checked){
			vals.push($(this).val());
		}
	});

	return vals;
};
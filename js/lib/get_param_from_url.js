/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-8-6
 * Time: 上午11:16
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */



//获取地址栏参数
DEVICE.getParamFromUrl = function(param){
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
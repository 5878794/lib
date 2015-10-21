/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-9-25
 * Time: 下午8:53
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */


//开始震动
//DEVICE.shock.start([30]);
//opt:array    eg:[2000,1000,1000]  单位:ms
//停止震动
//DEVICE.shock.stop();


//震动api h5  目前只支持android 4.4+
if(!DEVICE.API){DEVICE.API={}}
DEVICE.API.shock = {
	canUse:function(){
		return  "vibrate" in navigator;
	},
	start:function(opt){
		if(!this.canUse()){return;}
		navigator.vibrate(opt);
	},
	stop:function(){
		if(!this.canUse()){return;}
		navigator.vibrate([]);
	}
};
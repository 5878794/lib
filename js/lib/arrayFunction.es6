//数组中数据作为参数自动循环执行一个函数 (异步)


// DEVICE.arrayFunction(
// 	[1,2,3,4,5],                        //要作为参数执行的数据
// 	function(number,next){              //需要执行的方法  参数 number为数组中的值
// 		setTimeout(function(){                              next 为执行下一步函数
// 			console.log(number);
// 			next();
// 		},1000)
// 	},
// 	function(){console.log("end")}      //数组执行完成回调
// );

DEVICE.arrayFunction = function(array,fn,callback){
	array = JSON.parse(JSON.stringify(array));
	var run = function(){
		if(array.length == 0){
			callback();
		}else{
			let param = array.shift();
			runner(param);
		}
	};

	var runner = function(param){
		fn(param,run);
	};


	run();
};
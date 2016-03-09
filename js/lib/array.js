/**
 * Created by bens on 16-1-13.
 */



//数组操作类
//--------------------------------------------------------------------

//数组添加数组
//Array.prototype.pushArray([1,2,3,4])

//获取数组中的最大值（数组中必须全数字）
//Array.prototype.findMax();

//获取数组中的最小值（数组中必须全数字）
//Array.prototype.findMin();

//数组排序（数组中必须全数字）
//@type= "" || "desc"      正序/倒序
//Array.prototype.sortByNumber(type)

//数组排序（排序的是全中文）
//数组中全中文或是对象中的某个key的值为全中文
//不指定key时默认认为数组中都是字符
//@type = "" || "desc"
//@key =  数组中对象的key值
//Array.prototype.sortByChine(key,type);

//删除数组中的重复值（不支持数组中含对象）
//Array.prototype.delReplace();








//将一个数组添加到另一个数组末尾  会改变原数组
Array.prototype.pushArray = function(b){
	this.push.apply(this,b);
	return this;
};
//获取数组中的最大值  数组中不能有字母或对象
// null,false转换为1  true转换为2   可以filter（function）后在求值
Array.prototype.findMax= function(){
	return Math.max.apply(null,this);
};
//获取数组中的最小值 数组中不能有字母
Array.prototype.findMin= function(){
	return Math.min.apply(null,this);
};
//数组排序  按数字大小   默认是按字符排序
Array.prototype.sortByNumber= function(type){
	if(type == "desc"){
		this.sort(function(a,b){ return (a>b)? -1 : 1; });
	}else{
		this.sort(function(a,b){ return (a>b)? 1 : -1; });
	}
	return this;
};
//数组排序  中文    数组中如果是对象使用key,否则传空   type默认从小到大，desc反序
Array.prototype.sortByChine= function(key,type){
	this.sort(function(a,b){
		if(key){
			a = a[key];
			b = b[key];
		}
		a = a.toString();
		b = b.toString();

		if(type == "desc"){
			return b.localeCompare(a);
		}else{
			return a.localeCompare(b);
		}
	});

	return this;
};
//删除数组中的重复项（不能处理对象）
Array.prototype.delReplace = function(){
	var arr = this,
		obj = {},
		back = [];

	for(var i= 0,l=arr.length;i<l;i++){
		var val = arr[i];
		if(!obj.hasOwnProperty(val)){
			obj[val] = true;
			back.push(val);
		}
	}

	return back;

};


//删除数组中的一个值 用原生的filter方法返回新数组  不写了
//  array.filter(function(a,index){if(a!=3){return a;}})
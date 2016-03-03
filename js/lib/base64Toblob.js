/**
 * Created by bens on 16-3-3.
 */



//手机不支持

//base64转blob对象
DEVICE.base64ToBlob = function(base64){
	var arr = base64.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while(n--){
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new Blob([u8arr], {type:mime});
};

//blob对象转uri 访问显示
DEVICE.blobToURI = function(blob){
	return src = window.URL.createObjectURL(blob);
};
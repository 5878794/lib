// 使用了manifest功能后,在document.ready后调用该方法,可以及时刷新缓存



DEVICE.mainfest = function(){
	var body = $("<div></div>");
	body.css3({
		width:"100%",height:"100%",position:"fixed",left:0,top:0,
		display: "box",
		"align-items":"center",
		"justify-content":"center",
		"z-index":"999999",
		background:"#000",color:"#eee"
	});
	$("body").append(body);


	window.applicationCache.addEventListener('checking', function(e) {
		body.text("正在检查更新");
	}, false);
	window.applicationCache.addEventListener('noupdate', function(e) {
		body.remove();
	}, false);
	window.applicationCache.addEventListener('downloading', function(e) {
		body.text("开始下载");
	}, false);
	window.applicationCache.addEventListener('progress', function(e) {
		body.text("下载"+e.loaded+"/"+e.total);
	}, false);
	window.applicationCache.addEventListener('updateready', function(e) {
		if(window.applicationCache.status == window.applicationCache.UPDATEREADY) {
			// Browser downloaded a new app cache.
			// Swap it in and reload the page to get the new hotness.
			window.applicationCache.swapCache();
			window.location.reload();
		}
	}, false);
	window.applicationCache.addEventListener('cached', function(e) {
		body.remove();
	}, false);
	window.applicationCache.addEventListener('obsolete', function(e) {
		body.remove();
	}, false);
	window.applicationCache.addEventListener('error', function(e) {
		body.remove();
	}, false);
};
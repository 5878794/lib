// 朗读文字
// iphone必须在点击事件后播放  >=ios7
//  android chrome>=55 才行


DEVICE.speak = function(text,lang,name){
	if(!window.speechSynthesis){console.log("not support speak!");return;}

	var synth = window.speechSynthesis,
		voices = synth.getVoices();
	lang = lang || "zh-cn";
	name = name || "google";


	var utterThis = new SpeechSynthesisUtterance(text);
	var opticon = [],
		selectOpticon = "";

	for(var i=0,l=voices.length;i<l;i++){
		var this_lang = voices[i].lang;

		if(this_lang.toLowerCase() == lang){
			opticon.push(voices[i]);
		}
	}

	if(opticon.length == 1){
		selectOpticon = opticon[i];
	}else if(opticon.length == 0){
		selectOpticon = voices[i];
	}else{
		for(var z=0,zl=opticon.length;z<zl;z++){
			var this_name = opticon[z].name;
			if(this_name.toLowerCase().indexOf(name)>-1){
				selectOpticon = opticon[z];
				break;
			}
		}
		if(!selectOpticon){
			selectOpticon = opticon[0];
		}
	}


	utterThis.voice = selectOpticon;
	synth.speak(utterThis);
};
/**
 * Created by bens on 16-2-23.
 */


//可编辑div插入html片段

//初始化
//var a = new DEVICE.divEditArea({
//	id:"test"
//});


//插入时执行
//a.insertHtml("<div style='color:red;'>123</div>");


(function(){

	//补丁
	if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment){
		Range.prototype.createContextualFragment = function(html){
			var frag = document.createDocumentFragment(),
				div = document.createElement("div");
			frag.appendChild(div);
			div.outerHTML = html;
			return frag;
		}
	}

	var divEditArea = function(opt){
		this.id = opt.id;

		this.dom = document.getElementById(this.id);

		this.sel = null;
		this.range = null;
		this.sel_length = null;

		this.init();
	};
	divEditArea.prototype = {
		init:function(){
			this.addEvent();
		},
		addEvent:function(){
			var _this = this;

			document.addEventListener("selectionchange",function(e){
				var id = e.target.activeElement.id;
				if(id == _this.id){
					_this.saveRange();
				}
			},false)
		},
		saveRange:function(){
			this.sel = window.getSelection();
			//选区中的第一个range
			this.range =  this.sel.getRangeAt(0);
		},
		showRange:function(){
			this.dom.focus();
			this.sel.removeAllRanges();
			this.sel.addRange(this.range);
		},
		//替换选取中的html
		insertHtml:function(html){
			this.dom.focus();
			//创建片段
			var hasR = this.range.createContextualFragment(html);
			var hasR_lastChild = hasR.lastChild;

			while (hasR_lastChild && hasR_lastChild.nodeName.toLowerCase() == "br" && hasR_lastChild.previousSibling && hasR_lastChild.previousSibling.nodeName.toLowerCase() == "br") {
				var e = hasR_lastChild;
				hasR_lastChild = hasR_lastChild.previousSibling;
				hasR.removeChild(e)
			}

			//删除原来选中的部分
			this.range.deleteContents();
			//插入新的
			this.range.insertNode(hasR);


			if (hasR_lastChild) {
				this.range.setStartAfter(hasR_lastChild);
				this.range.setEndAfter(hasR_lastChild);

			}

			//在次选中被替换部分
			this.sel.removeAllRanges();
			this.sel.addRange(this.range);
		}
	};

	DEVICE.divEditArea = divEditArea;
})();




/**
 * Created by bens on 16-2-23.
 */


//可编辑div插入html片段,html片段只能有一层不能有节点（比如插入一个图片）
//只支持新的浏览器  只测试了webkit

//初始化
//var a = new DEVICE.divEditArea({
//	id:"test"
//});


//在当前焦点处插入html片段
//a.insertHtml("<div style='color:red;'>123</div>");


//模拟点击键盘的删除，焦点处向前删除一个
//a.del();






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
		},
		del:function(){
			var start_obj = this.range.startContainer,
				end_obj = this.range.endContainer,
				start_offset = this.range.startOffset,
				end_offset = this.range.endOffset;

			if(start_obj == end_obj && start_offset == end_offset){
				//不是选区
				if(start_obj != this.dom){
					//是子元素
					if(start_offset == 0){
						//光标已到头
						if(start_obj.length == 0){
							//删除该节点
							start_obj.parentNode.removeChild(start_obj);
							this.del();
						}else{
							//移动焦点到节点外
							var all_node = this.dom.childNodes,
								z = 0;
							for(var i= 0,l=all_node.length;i<l;i++){
								if(all_node[i] == start_obj){
									z = i;
									break;
								}
							}
							this.range.setStart(this.dom,z);
							this.range.setEnd(this.dom,z);
							this.del();
						}
					}else{
						//非空元素
						this.range.setStart(start_obj,start_offset-1);
						this.range.setEnd(start_obj,start_offset);
						this.range.deleteContents();
					}
				}else{
					//不是子元素
					if(start_offset == 0){

					}else{
						var this_node = this.dom.childNodes[start_offset-1],
							node_type = this_node.nodeType;

						if(node_type !=3){
							this.range.setStart(start_obj,start_offset-1);
							this.range.setEnd(start_obj,start_offset);
							this.range.deleteContents();
						}else{
							//移动焦点到文本对象中的最后一位
							var n = this_node.length;
							this.range.setStart(this_node,n);
							this.range.setEnd(this_node,n);
							this.del();
						}
					}
				}
			}else{
				//是选区。直接删除
				this.range.deleteContents();
			}

			this.showRange();
		}
	};

	DEVICE.divEditArea = divEditArea;
})();



//$(document).ready(function(){
//	a = new DEVICE.divEditArea({
//		id:"test"
//	})
//    //
//    //$("body").click(function(){
//		//a.del();
//    //})
//})
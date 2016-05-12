/**
 * Created by beens on 16/5/3.
 */



//暂时没写完
// iframe 提交监听参考
// http://blog.csdn.net/wocaonima123987/article/details/8315423


DEVICE.fileUpload = function(opt){
    this.dom = opt.dom;
    this.serverSrc = opt.serverSrc;
    this.success = opt.success || function(){};
    this.error = opt.error || function(){};
    this.progress = opt.progress || function(){};

    this.isNewWebView = (function(){
        var a = new XMLHttpRequest();
        return (a.upload)? true : false;
    })();
    this.form = null;


    this.init();
};
DEVICE.fileUpload.prototype = {
    init:function(){
        this.createForm();
        this.createInput();
    },
    createForm:function(){
        var form = document.createElement("form");
        form.method = "POST";
        form.action = this.serverSrc;

        this.form = form;
        this.dom.append(form);
    },
    createInput:function(){

    }

};


$(document).ready(function(){
    new DEVICE.fileUpload({
        dom:$("#test")
    })
});
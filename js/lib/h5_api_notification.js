/**
 * Created by beens on 15/10/29.
 */


//显示桌面通知，所有参数都不是必须的
//DEVICE.notify.show({
//    title:"222",    //@param str  标题
//    body:"123",     //@param str  内容,不支持html
//    icon:"",     //@param str  图标
//    id:"aa",       //@param str  id  相同的id，多个信息只会弹出一个对话框
//    lang:"",     //@param str  语言，必须是规定的字符串
//    autoClose:false,  //@param bool  是否自动关闭，默认false
//    autoCloseTime:5000,  //@param number  自动关闭时间，autoClose为true有效,默认10秒
//    onclick:function(obj){},   //点击通知时执行,参数通知对象本身
//    onshow:function(obj){},     //通知显示时执行,参数通知对象本身
//    onclose:function(obj){}     //通知关闭时执行,参数通知对象本身
//});



DEVICE.notify = {
    //检查是否支持等
    _check:function(){
        //判断是否支持
        if(!Notification in window){
            return {
                state:false,
                canUse:false,
                msg:"浏览器不支持"
            };
        }

        //判断是否允许
        if(Notification.permission == 'granted'){
            return {
                state:true,
                canUse:true,
                msg:"ok"
            };
        }

        //判断是否禁止显示通知
        if(Notification.permission == 'denied'){
            return {
                state:false,
                canUse:false,
                msg:"用户禁止显示通知"
            }
        }

        //需要申请权限
        return{
            state:true,
            canUse:false,
            msg:"申请权限"
        }
    },
    //创建通知
    _create:function(opt){
        var title = opt.title || "",  //标题
            body = opt.body || "",    //内容
            icon = opt.icon || "",    //图标
            tag = opt.id || "",     //类似id，tag相同多条信息只在一个提示框中显示
            lang = opt.lang,  //语言
            autoClose = ($.isBoolean(opt.autoClose))? opt.autoClose : false,//自动关闭
            autoCloseTime = opt.autoCloseTime || 10000,  //显示多长时间（ms）关闭
            onclick = opt.onclick || function(){},  //点击执行
            onclose = opt.onclose || function(){},  //关闭执行
            onshow = opt.onshow || function(){};     //显示时执行


        var notification = new Notification(title, {
            icon: icon,
            lang:lang,
            body: body,
            tag:tag
        });



        notification.onshow = function(){
            onshow(this);
            if(autoClose){
                var that = this;
                setTimeout(function(){
                    that.close();
                },autoCloseTime);
            }
        };
        notification.onclose = function(){
            onclose(this);
        };

        notification.onclick = function(){
            onclick(this);
        };


    },
    show:function(opt){
        var res = this._check(),
            _this = this;

        //不能显示
        if(!res.state){
            if("console" in window){
                console.log("DEVICE.notify:"+res.msg);
            }
            return null;
        }


        if(res.state && !res.canUse){
            //申请权限
            Notification.requestPermission(function(permission) {
                //如果接受请求
                if (permission === "granted") {
                    _this._create(opt);
                }
            });
        }else{
            //直接显示
            _this._create(opt);
        }



    }
};
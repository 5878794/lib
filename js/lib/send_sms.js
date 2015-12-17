/**
 * Created by beens on 15/12/17.
 */





//调用发送短信界面
//DEVICE.sendSMS(10086,"11");
//也可以直接写成a链接。

DEVICE.sendSMS = function(phone,text){
    if(DEVICE.isAndroid || DEVICE.isIphone){
        window.location.href = "sms:"+phone+"?body="+text;
    }
};



//打电话
//DEVICE.tel(10086);
//也可以直接写成a链接


DEVICE.tel = function(number){
    if(DEVICE.isAndroid || DEVICE.isIphone) {
        window.location.href = "tel:" + number;
    }
};


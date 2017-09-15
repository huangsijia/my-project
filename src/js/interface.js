//正式版本服务器
// var host="";
var host = "http://10.0.1.49:9001";



export default {
    myHost: host,
    Model: {
        // 手机号密码登录
        loginOn: host + "/wd_api/userCenter/loginOn",
        // 找回密码获取短信验证码
        sendForgetPasswordSms: host + "/wd_api/userCenter/validRetrievePwdCodeOn",
        // 找回密码下一步
        validRetrievePwdCodeOn:host+"/wd_api/userCenter/validRetrievePwdCodeOn"
        // 保存修改后的密码
    }
}
/*
支持webview方法
cashloan://AppVersion app版本号
cashloan://AppOrderConfirmation  订单确认页面
cashloan://AppOrder  订单圈圈页面
cashloan://AppLogin  登录页面
*/
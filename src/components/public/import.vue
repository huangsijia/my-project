/**
 * Created by huangyexin on 2016/10/31.
 */
var Interface = require("./interface.js");
var MD5 = require("./md5.js");
require("./base64.js");
import Vue from 'vue'
import layer from '../../static/layer.js'
import myConfig from './config.js';
Vue.use(layer);
export default {
    myHost: Interface.default.myHost,
    collecInfo: {
        identification: "",
        accessToken: "",
        type: "H5",
        count: 0,
        sendData: []
    },

    /* @param paramObj 传入的对象
     * @param paramObj.pageName 页面名称
     * @param paramObj.itemName 控件名称
     * @param paramObj.eventName 事件名称
     * @param paramObj.eventRemarks 事件备注
     * @example
     * Public.createCollect({
           pageName: "HomePage",
           itemName: "ProductDescription",
           eventName: "onClick",
           eventRemarks: ""
       });
     */
    createx(paramObj) {
        if(!sessionStorage){
            return false;
        }
        
        var collecInfo = JSON.parse(sessionStorage.getItem("collecInfo"));

        if (!this.Auth.get() || !collecInfo) {
            return false;
        }

        this.collecInfo = collecInfo;

        var obj = {
            identification: this.collecInfo.identification,
            type: this.collecInfo.type,
            eventNumber: this.collecInfo.count,
            accessToken: this.collecInfo.accessToken,
            eventTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
            pageName: paramObj && paramObj.pageName || "",
            itemName: paramObj && paramObj.itemName || "",
            eventName: paramObj && paramObj.eventName || "",
            eventRemarks: paramObj && paramObj.eventRemarks || "",
        };

        this.collecInfo.count += 1;
        this.collecInfo.sendData.push(obj);

        sessionStorage.setItem("collecInfo", JSON.stringify(this.collecInfo));
    },
    sendCollect() {
        if (!this.Auth.get()) {
            return false;
        }

        this.API_GET({
            url: "addBehaviorInfoOnline",
            data: { parameter: this.collecInfo.sendData },
            success: (result) => {
                if (result.isSuccess) {
                    sessionStorage.removeItem("collecInfo");
                    this.collecInfo = {
                        identification: "",
                        accessToken: "",
                        type: "H5",
                        count: 0,
                        sendData: []
                    };
                }
            }
        });
    },
    Auth: {
        get: function() {
            var result = {};
            try {
                result = JSON.parse(localStorage['persion']);
                //添加时间戳 超过一天调用接口时 自动登出
                if (result && new Date().getTime() - result.timeStamp > 86400000) {
                    this.remove()
                    return 0
                }
            } catch (r) {
                result = sessionStorage['persion'] && JSON.parse(sessionStorage['persion']);
                if (result && new Date().getTime() - result.timeStamp > 86400000) {
                    this.remove()
                    return 0
                }
            }
            if ("object" === typeof result) {
                return result['accessToken'];
            }
            return 0;
        },
        set: function(_user) {
            window.setTokenFlag = true;
            //添加时间戳 超过一天调用接口时 自动登出
            _user.timeStamp = new Date().getTime()
            if (_user.accessToken && _user.accessToken == "app") {
                this.remove()
            } else {
                try {
                    window.setTokenFlag = true
                    localStorage['persion'] = JSON.stringify(_user);
                } catch (r) {
                    sessionStorage['persion'] = JSON.stringify(_user);
                }
            }
        },
        remove: function() {
            try {
                localStorage.removeItem('persion');
            } catch (r) {
                sessionStorage.removeItem('persion');
            }
        }
    },
    API_GET: function(config) {
        var data = config['data'] || {};
        var _this = this
        config['success'] = config['success'] || function() {};
        //新加密方式
        var POST = "POST";
        var SIGNATURE_METHOD = "HmacSHA1";
        var SIGNATURE_VERSION = "2016-12-20";
        var ACCESS_TOKEN = myConfig.appKey;
        var ACCESS_SECRET = "bbbbbb";
        //
        // data.channel=ACCESS_TOKEN

        var timeStamp = new Date().getTime() + "";
        //签名数据
        var sigData = {
                accessToken: this.Auth.get() ? this.Auth.get() : ACCESS_TOKEN,
                signatureMethod: SIGNATURE_METHOD,
                timestamp: timeStamp,
                signatureVersion: SIGNATURE_VERSION,
                appVersion: "appVersion",
                parameter: encodeURIComponent(JSON.stringify(data))
            }
            //传送数据
        var sendData = {
            accessToken: this.Auth.get() ? this.Auth.get() : ACCESS_TOKEN,
            signatureMethod: SIGNATURE_METHOD,
            timestamp: timeStamp,
            signatureVersion: SIGNATURE_VERSION,
            appVersion: "appVersion",
            parameter: JSON.stringify(data),
            signature: this.sig(POST, sigData, ACCESS_SECRET)
        }
        config['xhr'] = $.ajax({
            url: Interface.default.Model[config['url']],
            type: "post",
            dataType: "json",
            timeout : 10000, //超时时间设置，单位毫秒
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(sendData),
            success: function(response, textStatus, request) {
                if (response.data == null) { response.data = []; }
                if (response.isSuccess == false) {
                    if (response.status == "301") {
                        if(myConfig.isApp()){
                            _this.Auth.remove();
                            location.href="cashloan://AppLogin"
                        }else{
                            window.Hub.$emit("loginOut", response.message)
                            _this.Auth.remove();
                        }
                        if(typeof(config['error'])=="function"){
                            config['error']();
                        }                        
                        return
                    }
                    if (response.status == "500" ) {
                        //系统异常
                        window.Hub.$emit('toast',"服务器正忙，请稍后再试")
                        // window.Hub.$emit("networkError", true);
                        if(typeof(config['error'])=="function"){
                            config['error']();
                        }
                        return
                    }
                    if ( response.status == "501" || response.status == "401") {
                        window.Hub.$emit("networkError", true);
                        if(typeof(config['error'])=="function"){
                            config['error']();
                        }
                        return
                    }
                }
                //publicArr[cache['url']][cache['data']] = JSON.stringify(response);
                config['success'](response, request);
            },
            error: function(response) {
                //超时会进入error status = 0
                if(typeof(config['error'])=="function"){
                    config['error']();
                }
                if (response.status == "301") {
                    if(myConfig.isApp()){
                        _this.Auth.remove();
                        location.href="cashloan://AppLogin"
                    }else{
                        window.Hub.$emit("loginOut", response.responseJSON.message)
                        _this.Auth.remove();
                    }
                    
                    return
                }
                
                // // 无网络
                // if ((response.status == "0" && response.statusText == "error") || response.status == "404") {
                //     window.Hub.$emit("networkError", true);

                //     if(typeof(config['error'])=="function"){
                //         config['error']();
                //     }

                //     return false;
                // }

                window.Hub.$emit('toast',"服务器正忙，请稍后再试")
                // window.Hub.$emit("networkError", true);
            }
        })
    },
    //签名算法
    sig: function(post, params, accessSecret) {
        var newobj = {},
            tmparr = [], 
            queryEncode = [],
            query = [],
            name, value, subName, querytext;

        for (name in params) {
            tmparr.push(name);
            newobj[name] = params[name]; //复制一个新的obj,为了不影响原有formData数据
        }
        tmparr.sort();
        for (var i = 0, len = tmparr.length; i < len; i++) {
            name = tmparr[i];
            value = newobj[name];
            if (value instanceof Object) {
                value = JSON.stringify(value);
            }
            if (value !== undefined && value !== null) {
                query.push(name + '=' + value);
            }
        }
        var querytext = post + "&" + encodeURIComponent("/") + "&" + encodeURIComponent("&" + query.join('&')) + "&" + accessSecret
        return Base64.encode(MD5.MD5(querytext))
    },
    loadjs: function(src, func) {
        if (typeof func != 'function') {
            console.log('param 2 is not a function!!');
            return false;
        }
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        var head = document.getElementsByTagName('head').item(0);
        head.appendChild(script);
        script.onload = function() {
            func();
        }
    },
    initApp: function() {
        // alert("加载js")
        window.setDeviceready = this.myDeviceready;
        window.setBackbutton = this.myBackbutton;
        window.setExitApp = this.exitApp;

        this.loadjs('cordova.js', this.appFunc)
    },
    appFunc: function() {
        // alert("加载js成功回调")
        document.addEventListener('deviceready', window.setDeviceready, false);
    },
    myDeviceready: function() {
        // alert("监听事件注册完成")
        document.addEventListener('backbutton', window.setBackbutton, false);
    },
    myBackbutton: function() {
        // alert("返回按钮触发事件")
        //下面的if判断页面是否是id为indexPage的页面如果是才执行，否则执行else的返回上一页
        if (location.hash == "#/index/index" || location.hash == "#/invest" || location.hash == "#/home/index") {
            window.Hub.$emit('toast', '再点击一次退出!');
            document.removeEventListener("backbutton", window.setBackbutton, false); // 注销返回键
            document.addEventListener("backbutton", window.setExitApp, false); // 通过监听返回键绑定退出事件
            // 3秒后重新注册
            var intervalID = window.setTimeout(function() {
                window.clearTimeout(intervalID);
                document.removeEventListener("backbutton", window.setExitApp, false); // 注销返退出事件
                document.addEventListener("backbutton", window.setBackbutton, false); // 返回键
            }, 3000);
        } else {
            // navigate.app.backHistory();//相当于浏览器的后退
            history.back()
        }
    },
    exitApp: function() {
        navigator.app.exitApp();
    }

}
window.setToken = function(accessToken) {
    window.setTokenFlag = true
    if (accessToken && accessToken == "app") {
        //app未登录时传的标示
        try {
            localStorage.removeItem('persion');
        } catch (r) {
            sessionStorage.removeItem('persion');
        }
    } else {
        var persion = JSON.stringify({ "accessToken": accessToken });
        try {
            localStorage['persion'] = persion;
        } catch (r) {
            sessionStorage['persion'] = persion;
        }
    }
}
window.setDeviceready = function() {}
window.setBackbutton = function() {}
window.setExitApp = function() {}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "h+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
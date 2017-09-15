/**
 * Created by huangyexin on 2016/10/31.
 */
var Interface = require("./interface.js");
var MD5 = require("./md5.js");
import Vue from 'vue'
import layer from '../../static/layer.js'
Vue.use(layer);
export default {

    myHost: Interface.default.myHost,
    Auth: {
        only: true, //控制在get时，只获取一次
        get: function () {
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
                //传送token给app
                if (result.accessToken && this.only) {
                    try {
                        window.appPluginMethod.BindJPush(result.accessToken);

                    } catch (e) {
                        console.log('没有在APP里或APP没有这个方法');
                    }
                    this.only = false;
                }

                return result['accessToken'];
            }
            return 0;
        },
        set: function (_user) {

            window.setTokenFlag = true;
            //添加时间戳 超过一天调用接口时 自动登出
            _user.timeStamp = new Date().getTime()
            if (_user.accessToken && _user.accessToken == "app") {
                this.remove()
            } else {

                try {
                    window.setTokenFlag = true
                    localStorage['persion'] = JSON.stringify(_user);
                    //DOTO! 使用此方法需要解决切换用户后第一次访问的问题(立即token覆盖问题)
                } catch (r) {
                    sessionStorage['persion'] = JSON.stringify(_user);
                }
                //传送token给app
                if (_user && _user.accessToken) {
                    try {
                        window.appPluginMethod.BindJPush(_user.accessToken);
                    } catch (e) {
                        console.log('没有在APP里或APP没有这个方法');
                    }
                }
            }
        },
        remove: function () {
            try {
                localStorage.removeItem('persion');
            } catch (r) {
                sessionStorage.removeItem('persion');
            }
        }
    },
    API_GET: function (config) {
        var data = config['data'] || {};
        var _this = this
        config['success'] = config['success'] || function () { };
        config['fail'] = function (response) {
            //console.log(response);
            if (/重新登录/.test(response.message)) {
                this.Auth.remove();
            }
        };
        var _config = {
            'API_KEY': this.Auth.get(), //不可为null
            'SECRET': 'UYGGYG876T6759HUHI975T7GGKJO9786456EDC08'
        };

        var param = function (obj) {
            //console.log(_config);
            var newobj = { 'api_key': _config['API_KEY'], 'ct': 1, 'bt': 2 },
                tmparr = ['api_key', 'ct', 'bt'],
                query = [],
                name, value, subName, querytext;

            for (name in obj) {
                tmparr.push(name);
                newobj[name] = obj[name]; //复制一个新的obj,为了不影响原有formData数据
            }
            tmparr.sort();

            for (var i = 0, len = tmparr.length; i < len; i++) {
                name = tmparr[i];
                value = newobj[name];
                if (value instanceof Array) {
                    value = value.join(',');
                } else if (value instanceof Object) { //解决 select BUG
                    for (subName in value) {
                        value = value[subName];
                        break;
                    }
                }
                if (value !== undefined && value !== null) {
                    query.push(name + '=' + value);
                    //query.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
                }
            }
            querytext = _config['SECRET'] + query.join('').split('=').join('');
            return query.join('&') + '&sign=' + MD5.MD5(querytext).toUpperCase();
        };

        config['xhr'] = $.ajax({
            type: 'POST',
            url: Interface.default.Model[config['url']],
            data: (String(data) == '[object Object]' ? param(data) : data),
            dataType: 'json',
            success: function (response, textStatus, request) {
                if (response.data == null) { response.data = []; }
                if (response.isSuccess == false) {
                    //  if(response.status=="201"){
                    //      //业务异常 alert
                    //     alert(response.message)
                    // }
                    if (response.status == "301") {
                        //登出 alert
                        window.Hub.$emit("loginOut", response.message)
                        _this.Auth.remove();
                        return
                    }
                    if (response.status == "500") {
                        //系统异常
                        alert(response.message);
                        return
                    }
                    if (response.status == "501") {
                        //网络不稳定
                        alert(response.message)
                        return
                    }
                    if (response.status == "401") {
                        //非法客户端  网络异常
                        alert(response.message)
                        return
                    }

                }
                //publicArr[cache['url']][cache['data']] = JSON.stringify(response);
                config['success'](response, request);
            },
            error: config['error']
        });

    },
    initShare: function () {

        this.loadjs('//res.wx.qq.com/open/js/jweixin-1.0.0.js', this.shareJs)
    },
    shareJs: function () {
        $.ajax({
            url: Interface.default.Model["getWeiXinSign"],
            data: { url: location.href },
            success: (data) => {
                // 微信分享事件监听
                wx.config({
                    debug: false,
                    appId: data.appId, // 公众号的唯一标识
                    timestamp: data.timestamp, // 生成签名的时间戳
                    nonceStr: data.nonceStr, // 生成签名的随机串
                    signature: data.signature, // 签名
                    jsApiList: [
                        // 所有要调用的 API 都要加到这个列表中
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'hideMenuItems',
                        'hideAllNonBaseMenuItem',
                        'hideOptionMenu',
                        'hideOptionMenu',
                        'showMenuItems',
                        'hideMenuItem'
                    ]
                });
                var shareData = { //默认值
                    title: "花钱容易赚钱难，轻轻一点钱生钱！",
                    desc: "惊喜大红包已发送给您，请笑纳~！本月线上更多活动火热进行中，一起来赚钱吧！",
                    link: location.origin + "/m/xiangnian/#/index/index",
                    imgUrl: "http://bxwd-img.oss-cn-hangzhou.aliyuncs.com/upload/image/1706/68ab8210-e64c-44f5-b091-901dc7c55901.jpg"
                }
                wx.ready(() => {
                    //全部屏蔽掉
                    wx.hideOptionMenu();
                    wx.showMenuItems({
                        menuList: [
                            'menuItem:readMode', // 阅读模式
                            'menuItem:share:timeline', // 分享到朋友圈
                            'menuItem:copyUrl', // 复制链接
                            'menuItem:share:appMessage'
                        ]
                    });

                    //分享到朋友圈
                    wx.onMenuShareTimeline(shareData);
                    //分享到微信好友
                    wx.onMenuShareAppMessage(shareData);
                    wx.onMenuShareQQ(shareData);
                });
            }
        });
    },
    loadjs: function (src, func) {
        if (typeof func != 'function') {
            console.log('param 2 is not a function!!');
            return false;
        }
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        var head = document.getElementsByTagName('head').item(0);
        head.appendChild(script);
        script.onload = function () {
            func();
        }
    },
    initApp: function () {
        // alert("加载js")
        window.setDeviceready = this.myDeviceready;
        window.setBackbutton = this.myBackbutton;
        window.setExitApp = this.exitApp;

        this.loadjs('cordova.js', this.appFunc)
    },
    appFunc: function () {
        // alert("加载js成功回调")
        document.addEventListener('deviceready', window.setDeviceready, false);
    },
    myDeviceready: function () {
        // alert("监听事件注册完成")
        document.addEventListener('backbutton', window.setBackbutton, false);
    },
    myBackbutton: function () {
        // alert("返回按钮触发事件")
        //下面的if判断页面是否是id为indexPage的页面如果是才执行，否则执行else的返回上一页
        if (location.hash == "#/index/index" || location.hash == "#/invest" || location.hash == "#/home/index") {
            window.Hub.$emit('toast', '再点击一次退出!');
            document.removeEventListener("backbutton", window.setBackbutton, false); // 注销返回键
            document.addEventListener("backbutton", window.setExitApp, false); // 通过监听返回键绑定退出事件
            // 3秒后重新注册
            var intervalID = window.setTimeout(function () {
                window.clearTimeout(intervalID);
                document.removeEventListener("backbutton", window.setExitApp, false); // 注销返退出事件
                document.addEventListener("backbutton", window.setBackbutton, false); // 返回键
            }, 3000);
        } else {
            // navigate.app.backHistory();//相当于浏览器的后退
            history.back()
        }
    },
    exitApp: function () {
        navigator.app.exitApp();
    },
    whichApp: function () {
        var ua = navigator.userAgent.toLocaleLowerCase();
        if (/xiangnianios/.test(ua)) {
            return 'ios';
        } else if (/xiangnianandroid/.test(ua)) {
            return 'android';
        } else {
            return 'browser';
        }
    }


}
window.setDeviceready = function () { }
window.setBackbutton = function () { }
window.setExitApp = function () { }
    // if(this.options.debug && !/.com/.test(location.host) && Auth.get() == 0){
    //     setTimeout(function(){
    //         var str1=prompt('请输入用户名','');
    //         var str2=prompt('请输入密码','');
    //         if(str1 && str2){
    //             API_GET({
    //                 url : 'loginOn',
    //                 data : { username : str1, password : str2 },
    //                 success : function(result){
    //                     if (result.isSuccess) {
    //                         Auth.set(result.data);
    //                     }else{
    //                         alert(result.message);
    //                     }
    //                 }
    //             });
    //         }
    //     },0);
    // }
    // var jumpApp = function(response) {
    //     try{localStorage.setItem('appFunc',JSON.stringify(response));}catch(r)
    //     {sessionStorage.setItem('appFunc',JSON.stringify(response));}
    // }
    // window.setToken = function(accessToken){

//     Auth.set({"accessToken": accessToken});
// }
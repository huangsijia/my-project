export default {
    isWeiXin:function(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;      
        }
    },
    setTopClass:function(){
        if(this.isWeiXin()){
            return ""
        }else{
             return "loadmoreTop"
        }
    }
}
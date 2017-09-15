<template>
    <div class="forgetPwd">        
        <div class="whiteBg">
            <mt-field type="tel" class="tel" label="" placeholder="请输入手机号" v-model="tel" autocomplete="off" :attr="{ maxlength: 11 }" :class="telCheck ? '' : red"></mt-field>
            <mt-field type="tel" class="picVerify" label="" placeholder="请输入图片验证码" v-model="picVerify" autocomplete="off" :attr="{ maxlength: 5 }" :class="picCheck ? '' : red"></mt-field>
            <mt-field type="tel" class="verification" label="" placeholder="请输入短信验证码" v-model="verification" autocomplete="off" :attr="{ maxlength: 6 }" :class="msgCheck ? '' : red"></mt-field>
            <div class="verify" @click = "ycjbug">
                    <verification :inputValue='picVerify' @verifyValue='verifyValue' :num='5'></verification>
                </div>
            <span class="obtain" @click="obtain">{{countText}}</span>            
        </div>
        <div class="next">
            <button :disabled="disabled" @click="next" class="button">下一步</button>
        </div>
    </div>
</template>

<script>
import verification from '../public/verification'
import { Field,Toast,MessageBox } from 'mint-ui'

export default {
    components: {
        verification,
        mtField:Field,
        Toast,
        MessageBox
    },
    data() {
        return {
            tel:"",
            picVerify:"",
            verification:"",
            telCheck:"",
            picCheck:"",
            msgCheck:"",
            red:"red",
            
            telCheck:false,
            picCheck:false,
            msgCheck:false,
            picVerify: JSON.parse(sessionStorage.getItem("loginDate")) && JSON.parse(sessionStorage.getItem("loginDate")).tel== sessionStorage.getItem('tel') ? JSON.parse(sessionStorage.getItem("loginDate")).picVerify : '', // 图片验证码
            countText: '', // 倒计时的内容
            countStamp: 0,// 时间戳
            count: 60,
        }
    },
    watch: {
        tel:function(telValue){
            this.telCheck = telValue.length == 11 && /^1(3|4|5|7|8)\d{9}$/.test(telValue) ? this.telCheck = true : this.telCheck = false;
        },
        picVerify: function(value) {
            if(value.length < 5 || !/^\d+$/g.test(value)){
                this.picCheck = false
            }
        },
        verification: function(value) {
            this.msgCheck = value.length < 6 || !/^\d+$/g.test(value) ? this.msgCheck = false : this.msgCheck = true;
        },
    },
    computed:{
        'disabled':{
             get: function () {
                var abc= !this.telCheck || !this.picCheck || !this.msgCheck
                console.log(abc)
                return abc
                },
                // setter
            set: function (newValue) {
                return false    
            }
        }
    },
    methods: {
        saveLoginDate() {
            var loginDate = {
                picVerify: this.picVerify
            }
            sessionStorage.setItem("loginDate", JSON.stringify(loginDate))
        },
        next() {
            Public.API_GET({
                url:"validRetrievePwdCodeOn",
                data:{
                    mobile:this.tel,
                    verifyNo:this.verification
                },
                success:(json) => {
                     if (!json.isSuccess) {
                        Toast({
                            message: json.message,
                            position: 'middle',
                            duration: 3000
                        });
                        return false;
                    } else {
                        this.$router.push({ path: '/index/resetPwd' });
                    }
                }
            })
        },
        ycjbug(){
            this.picVerify = "";
            return false;
        },
        verifyValue(value) {
            //图形验证码与输入值不匹配
            if(!value){
                Toast({
                    message: '请输入正确的图形验证码',
                    position: 'middle',
                    duration: 3000
                });
                this.picCheck = false;
                return false;
            }
            //图形验证码与输入值匹配，但未输入手机号
            if(!this.telCheck){
                this.tel = "";
                this.picVerify = "";
                Toast({
                    message: '请检查手机号码',
                    position: 'middle',
                    duration: 3000
                });
            }
            //手机号，图形验证码均正确发送验证码，短信验证码获得焦点
            this.picCheck = true;
            if (this.telCheck && this.picCheck) {
                this.getVerification();
                $("#verification").focus();
            }           
        },
        getVerification() {            
            if(this.countText.indexOf('s') != -1){
                return false;
            }
            Public.API_GET({
                url: 'sendForgetPasswordSms',
                data: {
                    mobile: this.tel,
                },
                success:(json) => {
                    if(!json.isSuccess){
                        Toast({
                            message: json.message,
                            position: 'middle',
                            duration: 3000
                        });
                    }else{
                        this.countStamp = new Date().getTime();
                        this.countText = this.count + 's';
                        var timer = setInterval(() => {
                            this.countText = --this.count + 's'
                            if (this.countText == '0s') {
                                clearInterval(timer)
                                this.countText = '重新获取'
                                this.count = 60;
                                this.countDown = false;
                            }
                        }, 1000)
                    }
                }
            })

        },
        obtain() {
            if(!this.telCheck){
                 Toast({
                    message: "请输入手机号",
                    position: 'middle',
                    duration: 3000
                });
                return false;
            }
            if(!this.picCheck){
                 Toast({
                    message: "请输入图片验证码",
                    position: 'middle',
                    duration: 3000
                });
                return false;
            }
            this.getVerification();
        }
    },
    mounted(){
        // value.length == 11 && !/^1(3|4|5|7|8)\d{9}$/.test(value)
        window.Hub.$emit('setTitle', '忘记密码', true);
        window.Hub.$emit('setFooter', false);
        this.countText = "获取验证码";
    }
}    
</script>

<style lang="scss" type="text/css">
@import "../../assets/skin";
.forgetPwd{
    width:90%;
    margin:3rem auto;
    .tel .mint-cell-wrapper{
        background-image:none;
    }
    .verify{
        position:absolute;
        top: 40%;
        right: 3rem;
        width: 120px;
        height: 35px;
        .verification{
            width: 100%;
            height: 100%;
            position: relative;            
            div{            
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%,-50%);
            transform: translate(-50%,-50%);
            }
        }    
    }
    .obtain{
        position:absolute;
        bottom:1rem;
        right:4rem;
    }
    .red input{
        color:$red;
    }
}
</style>
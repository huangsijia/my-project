<template>
    <div class="register">
        <div class="whiteBg">
            <mt-field type="tel" class="tel" label="" placeholder="请输入手机号" v-model="tel" autocomplete="off" :attr="{ maxlength: 11 }" :class="telCheck ? '' : red"></mt-field>
            <mt-field type="tel" class="verification" label="" placeholder="请输入短信验证码" v-model="verification" autocomplete="off" :attr="{ maxlength: 6 }" :class="msgCheck ? '' : red"></mt-field>
            <span class="obtain" @click="obtain">{{countText}}</span>
        </div>
        <div class="sureRegister">
            <button :disabled="disabled" @click="next" class="button">注册</button>
        </div>
    </div>
</template>

<script>
import { Field,Toast,MessageBox } from 'mint-ui'

export default {
    components: {
        mtField:Field,
        Toast,
        MessageBox
    },
    data() {
        return {
            tel:"",
            verification:"",
            red:"red",            
            telCheck:false,
            msgCheck:false,            
            countText: '', // 倒计时的内容
            countStamp: 0,// 时间戳
            count: 60,
        }
    },
    watch: {
        tel:function(telValue){
            this.telCheck = telValue.length == 11 && /^1(3|4|5|7|8)\d{9}$/.test(telValue) ? this.telCheck = true : this.telCheck = false;
        },
        verification: function(value) {
            this.msgCheck = value.length < 6 || !/^\d+$/g.test(value) ? this.msgCheck = false : this.msgCheck = true;
        },
    },
    computed:{
        'disabled':{
             get: function () {
                var btnDisabled= !this.telCheck || !this.msgCheck
                return btnDisabled
                },
                // setter
            set: function (newValue) {
                return false    
            }
        }
    },
    methods: {
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
                        this.$router.push({ path: '/index/index' });
                    }
                }
            })
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
            this.getVerification();
        }
    },
    mounted(){
        window.Hub.$emit('setTitle', "注册", true)
        window.Hub.$emit('setFooter', false);
        this.countText = "获取验证码";
    }
}    
</script>

<style lang="scss" type="text/css">
@import "../../assets/skin";
.register{
    width:90%;
    margin:3rem auto;
    .tel .mint-cell-wrapper{
        background-image:none;
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
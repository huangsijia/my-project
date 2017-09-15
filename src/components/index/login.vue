<template>
    <div class="loginNow">
        <div class="whiteBg">
            <div>
                <mt-field type="tel" class="tel" label="" placeholder="请输入手机号" v-model="tel" autocomplete="off" :attr="{ maxlength: 11 }" :class="telCheck ? '' : red"></mt-field>            
                <mt-field :type="typeAttr" class="password" label="" placeholder="请输入登录密码" v-model="password" :attr="{ maxlength: 16 }" :class="pwdCheck ? '' : red"></mt-field>
                <span v-show="showEye" :class="eye" @click="showOrHide"></span>
            </div>
        </div>
        <div class="enter">
            <button :disabled="disabled" @click="login" class="button">登&nbsp;&nbsp;录</button>
        </div>
        <div class="clearfix toPage">
            <div class="forgetPwdLink fl">
                <router-link to="/index/forget">忘记密码</router-link>
            </div>
            <div class="registerNowLink fr">
                <router-link to="/index/register">立即注册</router-link>
            </div>
        </div>        
    </div>
</template>

<script>
import { Field,Toast,MessageBox } from 'mint-ui';
export default {
    components: {
    mtField:Field,
    Toast,
    MessageBox
  },
    data() {
        return {            
            tel:"",
            password:"",
            showEye:true,
            telCheck:false,
            pwdCheck:false,
            disabled:"disabled",
            red:"red",
            typeAttr:"password",
            showPwd:true,
            hidePwd:false,
            eye:""
        }
    },
    watch: {
        tel:function(telValue){
            this.telCheck = telValue.length == 11 && /^1(3|4|5|7|8)\d{9}$/.test(telValue) ? this.telCheck = true : this.telCheck = false;
            this.disabled = this.telCheck && this.pwdCheck ? false : "disabled";
        },
        password:function(pwdValue){
            this.showEye = pwdValue.length > 0 ?  this.showEye = true :this.showEye = false;
            this.pwdCheck = pwdValue.length > 5 ?  this.pwdCheck = true :this.pwdCheck = false;
            this.disabled = this.telCheck && this.pwdCheck ? false : "disabled";   
            this.eye = this.showPwd ? 'eye hideEye' : 'eye';
        }
    },
    methods: {
        login() {
            Public.API_GET({
                url:"loginOn",
                data:{
                    mobile:this.tel,
                    password:this.password
                },
                success:(json) => {
                     if (!result.isSuccess) {
                         Toast({
                                message: "手机或者密码错误",
                                position: 'middle',
                                duration: 3000
                            });
                         return false;
                     }else{
                        sessionStorage.setItem('tel', this.tel);
                        if (this.$route.query && this.$route.query.redirect) {
                            this.$router.push(this.$route.query.redirect)
                        } else {
                            this.$router.push("/index/index")
                        }
                     }
                }
            })
        },
        showOrHide() {
            if(this.showPwd){
                this.showPwdMethod();
            }else{
                this.hidePwdMethod();
            }
        },
        showPwdMethod() {
            this.typeAttr = "text";
            this.showPwd = false;
            this.hidePwd = true;
            this.eye = this.showPwd ? 'eye hideEye' : 'eye';
        },
        hidePwdMethod() {
            this.typeAttr = "password";
            this.showPwd = true;
            this.hidePwd = false;            
            this.eye = this.hidePwd ? 'eye' : 'eye hideEye';
        }
    },
    mounted(){
        window.Hub.$emit('setTitle', '登录', true);
        window.Hub.$emit('setFooter', false);
    }
}    
</script>

<style lang="scss" type="text/css">
@import "../../assets/skin";
.loginNow{
    width:90%;
    margin:3rem auto;
    .whiteBg{position:relative;}
    .tel .mint-cell-wrapper{
        background-image:none;
    }
    .enter{
        
    }
    .toPage{
        margin-top:2rem;
    }
    .red input{
        color:$red;
    }
    .eye{
        position: absolute;
        bottom: 0;
        right: 16%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        display: inline-block;
        width: 2rem;
        height: 2rem;
        background: url(../../assets/images/eyeShow.png) 50% no-repeat;
        background-size: 2rem 2rem;
    }
    .hideEye{        
        background: url(../../assets/images/eyeHide.png) 50% no-repeat;
        background-size: 2rem 2rem;
    }
}
</style>
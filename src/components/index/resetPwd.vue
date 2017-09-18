<template>
    <div class="resetPwd">        
        <div class="whiteBg">
            <mt-field :type="typeAttr" class="password" label="" placeholder="新密码" v-model="password" autocomplete="off" :attr="{ maxlength: 16 }" :class="pwdCheck ? '' : red"></mt-field>
            <mt-field :type="typeAttr" class="newPassword" label="" placeholder="确认密码" v-model="newPassword" autocomplete="off" :attr="{ maxlength: 16 }" :class="newPwdCheck ? '' : red"></mt-field>
            <span v-show="showEye" :class="eye" @click="showOrHide"></span>
        </div>
        <p :class="red" class="tips">{{tips}}</p>
        <div class="sure">
            <button :disabled="disabled" @click="next" class="button">确&nbsp;&nbsp;认</button>
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
            password:"",
            newPassword:"",
            pwdCheck:false,
            newPwdCheck:false,
            red:"red",
            showEye:true,
            hidePwd:false,
            eye:"eye hideEye",
            typeAttr:"password"
        }
    },
    computed: {
        'disabled':{
            get:function(){
                var btnDisabled = !this.pwdCheck || !this.newPwdCheck;
                return btnDisabled;
            },
            set:function(){
                return false;
            }
        },
        "tips":{
            get:function(){
                if(!this.pwdCheck || !this.newPwdCheck){
                    return "* 密码长度需为6-16个字符,两次输入的密码需一致";
                }else{
                    return ""
                }                
            },
            set:function(){
                return false;
            }
        }
    },
    watch: {
        password:function(pwdValue){
            if(pwdValue.length < 6){
                this.pwdCheck = false;
            }else{
                this.pwdCheck = true;
            }
            if(this.newPassword < 6 || this.newPassword != pwdValue){
                this.newPwdCheck = false;
            }else{
                this.newPwdCheck = true;
            }
        },
        newPassword:function(newPwdValue){
            if(newPwdValue.length < 6 || this.password && this.password != newPwdValue){
                this.newPwdCheck = false;
            }else{
                this.newPwdCheck = true;
            }
        }
    },
    methods: {
        next(){
            if (this.password.length < 6) {
                Toast({
                    message: '密码不能少于6位',
                    position: 'middle',
                    duration: 3000
                });
                return false
            }
            if (this.password != this.newPassword) {
                Toast({
                    message: '两次密码输入不一致',
                    position: 'middle',
                    duration: 3000
                });
                return false
            }
            Public.API_GEt({
                url:"modifyPassword",
                data:{
                    mobile:sessionStorage.getItem("tel"),
                    password:this.password,
                },
                success:(result) => {
                    if(!result.isSuccess){
                        Toast({
                            message: result.message,
                            position: 'middle',
                            duration: 3000
                        });
                        return false
                    }else{
                        Toast({
                            message: "修改成功",
                            position: 'middle',
                            duration: 3000
                        });
                    }
                }
            })
        },
        showOrHide(){
           if(this.showPwd){
                this.showPwdMethod();
            }else{
                this.hidePwdMethod();
            }
        },
        showPwdMethod() {
            this.typeAttr = "password";
            this.showPwd = false;
            this.hidePwd = true;
            this.eye = this.showPwd ? 'eye' : 'eye  hideEye';
        },
        hidePwdMethod() {
            this.typeAttr = "text";
            this.showPwd = true;
            this.hidePwd = false;            
            this.eye = this.hidePwd ? 'eye hideEye' : 'eye';
        }
    },
    mounted(){
        window.Hub.$emit('setTitle', '重置密码', true);
        window.Hub.$emit('setFooter', false);
    }
}    
</script>

<style lang="scss" type="text/css">
@import "../../assets/skin";
.resetPwd{
    width:90%;
    margin:3rem auto;
}
.password .mint-cell-wrapper{
    background-image:none;
}
.newPassword.mint-cell:last-child{
    background-image:none;
}
.mint-cell-wrapper{
        background-size:76% 1px;
}
.red{
    color:$red;
}
.tips{    
    margin-top:2rem;
}
.eye{
        position: absolute;
        top: 40%;
        right: 16%;
        -webkit-transform: translateY(-50%,-50%);
        transform: translateY(-50%,-50%);
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
</style>
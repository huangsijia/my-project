<template>
    <div class="register">
        <div class="whiteBg">
            <div class="registerTel borderLine ipt">
                <input type="tel" placeholder="请输入手机号" autocomplete="off" maxlength="11"  class="input"/>
            </div>
            <div class="registerVerify borderLine ipt">
                <input type="tel" placeholder="请输入图片验证码" autocomplete="off" maxlength="5" class="input"/>
            </div>
            <div class="registerVerificate ipt">
                <input type="tel" placeholder="请输入短信验证码" id="verification" maxlength="6"  class="input" />
                <span class="obtain">重新获取</span>
            </div>
        </div>
        <div class="sureRegister">
            <button disabled @click="next" class="button">注册</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    methods: {
        next() {

        }
    },
    mounted(){
        window.Hub.$emit('setTitle', "注册", true)
        window.Hub.$emit('setFooter', false);
    }
}    
</script>

<style lang="scss" type="text/css">
.register{
    width:90%;
    margin:3rem auto;
}
</style>
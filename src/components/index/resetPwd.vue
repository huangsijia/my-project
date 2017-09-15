<template>
    <div class="resetPwd">        
        <div class="whiteBg">
            <div class="newPwd borderLine ipt">
                <input type="tel" placeholder="新密码" autocomplete="off" maxlength="11"  class="input"/>
            </div>
            <div class="surePwd ipt">
                <input type="tel" placeholder="确认密码" autocomplete="off" maxlength="5" class="input"/>
            </div>
        </div>
        <div class="sure">
            <button disabled @click="next" class="button">确&nbsp;&nbsp;认</button>
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
        next(){
            
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
</style>
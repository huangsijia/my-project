<template>
    <div class="form">
        <div class="tel">
            <input type="tel" placeholder="请输入手机号" autocomplete="off" maxlength="11"  />
        </div>
        <div class="password">
            <input type="password"  placeholder="请输入手机号" autocomplete="off" maxlength="16" />
        </div>
        <div class="enter">
            <button disabled @click="login">登录</button>
        </div>
        <div class="forgetPwd">
            <router-link to="">忘记密码</router-link>
        </div>
        <div class="registerNow">
            <router-link to="">立即注册</router-link>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            msg:"个人中心"
        }
    }
}    
</script>
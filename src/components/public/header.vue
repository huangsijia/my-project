<template>
    <section class="top clearfix">
        <div class="logo fl">
            <router-link to="/index"><img class="logoImg" src="../../assets/images/logo.png"></router-link>
        </div>
        <div class="login fr">
            <router-link to="/home/login">登录</router-link>
        </div>
    </section>
</template>
<script>
export default {
    props: ['title','leftIcon','rightIcon'],
    data (){
        return {

        }
    }
}
    
        
</script>
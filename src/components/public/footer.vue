<template>
    <section class="myFooter" v-show='showFlag'>
        <ul>
            <router-link to="/index/index">
                <li>首页</li>
            </router-link>
            <router-link to="/bill/index">
                <li>账单</li>
            </router-link>
            <router-link to="/index/login">
                <li>我的</li>
            </router-link>
        </ul>
    </section>
</template>

<script>
    export default {
        data(){
            return {
                showFlag: false
            }
        },
        beforeCreate() {
            window.Hub.$on('setFooter',(flag) => {
                this.showFlag = flag
            })
        }
    }
</script>
<template>
    <p>{{msg}}</p>
</template>

<script>
export default {
    data() {
        return {
            msg:"个人中心"
        }
    },
    mounted() {
        window.Hub.$emit('setTitle', "个人中心", true)
        window.Hub.$emit('setFooter',true)
    }
}    
</script>
<style lang="scss" type="text/css">
@import "../../assets/skin";
</style>
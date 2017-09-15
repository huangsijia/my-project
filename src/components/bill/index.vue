<template>
    <p>{{msg}}</p>
</template>

<script>
export default {
    data() {
        return {
            msg:"终于出来啦"
        }
    },
    mounted() {
        window.Hub.$emit('setTitle', "流水账", false)
        window.Hub.$emit('setFooter',true)
    }
}    
</script>
<style lang="sass-loader">
@import "../../assets/skin";
</style>
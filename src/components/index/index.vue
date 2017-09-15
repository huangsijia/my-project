<template>
  <p>{{msg}}</p>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      msg:"hsj你是不是傻"
    }
  },
  mounted() {
    window.Hub.$emit('setTitle', "iheimo", false)
    window.Hub.$emit('setFooter',true)
  }
}
</script>
<style lang="sass-loader">
@import "../../assets/skin";
</style>


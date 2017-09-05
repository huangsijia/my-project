<template>
  <div class="main-body">
    <my-header :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon"></my-header>
    <div class="content">
      <router-view></router-view>
    </div>
    <my-footer></my-footer>
  </div>
</template>

<script>
import header from './components/public/header.vue'
import footer from './components/public/footer.vue'

export default {
  components: {
    myHeader:header,
    myFooter:footer
  },
  data() {
    return {
      title: "",
      leftIcon: "",
      rightIcon: ""
    }
  },
  methods:{
    setTitle: function (Name) {
      this.title = Name;
      document.title = Name;
    }
  },
  beforeCreate: function() {
    window.Hub.$on('setTitle',(title,leftIcon,rightIcon) => {
      this.leftIcon = leftIcon;
      this.rightIcon = rightIcon;
      this.setTitle(title);
    })
  }
}
</script>
<style lang='sass-loader'>
  @import './assets/skin'
</style>
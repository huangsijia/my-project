<template>
  <div class="main-body">
    <my-header :title="title" :hideLeftFlag="hideLeftFlag"></my-header>
    <div class="content">
      <router-view></router-view>
    </div>
    <my-footer></my-footer>
  </div>
</template>

<script>
import 'mint-ui/lib/style.css'
import header from './components/public/header.vue'
import footer from './components/public/footer.vue'
import { Field,Toast,MessageBox } from 'mint-ui';

export default {
  components: {
    myHeader:header,
    myFooter:footer,
    mtField:Field,
    Toast,
    MessageBox
  },
  data() {
    return {
      title: "",
      hideLeftFlag: true
    }
  },
  methods:{
    setTitle: function (Name) {
      this.title = Name;
      document.title = Name;
    }
  },
  beforeCreate: function() {
    window.Hub.$on('setTitle',(title,hideLeftFlag) => {
      this.setTitle(title);
      this.hideLeftFlag = hideLeftFlag;
    });
  }
}
</script>

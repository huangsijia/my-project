<template>
    <section class="top clearfix">
      <template v-if="hideLeftFlag">
        <div class="icon-caretLeft" @click="leftFun"></div>
      </template>
      <div class="main-title">{{title}}</div>
    </section>
</template>
<script>
export default {
    props: ['title','hideLeftFlag'],
    data (){
        return {
        }
    },
    methods:{
        leftFun() {
            history.back();
        }
    }
}
    
        
</script>
<style lang="sass-loader">
    .top .icon-caretLeft {
    width: 50px;
    height: 50px;
    background: url(../../assets/images/head_top_arr.png) no-repeat center center;
    background-size: 13px 18px;
    display: block;
    position: absolute;
    left:0;
}
</style>
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  created() {
    const that = this;
    const localPath = localStorage.getItem('path');
    if(localPath){
      if(localPath == "/"){
         that.$router.push({path: '/index/:id'});
      }
       that.$router.push(localPath);
    }else{
       that.$router.push({path: '/index/:id'}); // 页面加载时跳转 
    }
  },
}
</script>

<style lang="less">
@import "~css/reset.less";
html,body,#app {
  width: 100%;
  height: 100%;
  font-family: "Microsoft Yahei","Helvetica Neue",Helvetica,Arial,Verdana,sans-serif!important;
}
#app {
  overflow: hidden;
}
.el-message {
  background-color: #ffffff;
}
</style>

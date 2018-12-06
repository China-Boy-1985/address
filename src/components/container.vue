<template>
  <div class="main">
    <div class="left" ref="menu">
      <div class="title"><img src="./../../static/image/logo.png" alt=""> <span v-if="!labelFlag" style="padding-left:17px;"></span></div>
      <v-side></v-side>
    </div>
    <div class="right">
      <v-head @headMenu="head"></v-head>
      <transition name="move" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
<script>
  import vHead from './header.vue'
  import vSide from './sidebar.vue'
  export default {
    components: {
      vHead: vHead,
      vSide: vSide
    },
    data() {
      return {
        labelFlag: false,
        transitionName: ''
      }
    },
    computed: {
    },
    methods: {
      head: function(data) {
        const that = this;
        if (data) {
          that.labelFlag = true;
        } else {
          that.labelFlag = false;
        }
      }
    },
    mounted() {
      const that = this;
    }
  }
</script>
<style lang="less">
  .main {
    display: flex;
    width: 100%;
    min-width: 1200px;
    height: 100%;
    background-color: #f5f5f5;
  }
  .el-menu {
    border-right: none;
    background-color: #32404f
  }
  .el-menu-item:hover {
    background-color: #2c3845
  }
  .el-submenu__title:hover {
    background-color: #2c3845
  }
  .left {
    box-sizing: border-box;
    height: 100%;
    background-color: #32404f;
    text-align: center;
    .title {
      height: 90px;
      color: #fff;
      overflow: hidden;
      word-wrap: break-word;
    }
    .title img {
      display: inline-block;
      height: 36px;
      margin-top: 25px;
      vertical-align: middle;
    }
    ul li.item {
      width: 100%;
      display: block;
      height: 54px;
      line-height: 54px;
      font-size: 16px;
      color: #fff;
      text-align: left;
      box-sizing: border-box;
    }
  }
  .left ul li.item p {
    padding: 0 0 0 20px;
    border-left: 5px solid #32404f;
    margin: 0;
  }
  .left ul li.item a {
    color: #fff;
    box-sizing: border-box;
  }
  .left ul li.item .active {
    background: #2c3845;
    border-left: 5px solid #32c39a;
  }
  .animationLeft {
    box-sizing: border-box;
    animation: myfirst 0.5s;
    width: 100px;
    height: 100%;
    background-color: #32404f;
    text-align: center;
    .title {
      height: 58px;
      line-height: 58px;
      color: #fff;
      overflow: hidden;
      word-wrap: break-word;
    }
    .title img {
      display: inline-block;
      height: 36px;
      margin-top: 27px;
      margin-left: 6px;
      vertical-align: middle;
    }
    ul {
      padding-top: 43px;
    }
    ul li.item {
      width: 100%;
      display: block;
      height: 54px;
      line-height: 54px;
      font-size: 16px;
      color: #fff;
      text-align: left;
      box-sizing: border-box;
    }
  }
  .animationLeft ul li.item p {
    padding: 0 0 0 20px;
    border-left: 5px solid #32404f;
    margin: 0;
  }
  .animationLeft ul li.item a {
    color: #fff;
    box-sizing: border-box;
  }
  .animationLeft ul li.item a span {
    overflow: hidden;
    word-wrap: break-word;
  }
  .animationLeft ul li.item .active {
    background: #2c3845;
    border-left: 5px solid #32c39a;
  }
  @keyframes myfirst {
    from {
      width: 240px;
    }
    to {
      width: 100px;
    }
  }
  @keyframes myfirst01 {
    from {
      width: 100px;
    }
    to {
      width: 240px;
    }
  }
  ul li.item a img {
    vertical-align: middle;
  }
  .right {
    flex: 1;
    height: 100%;
  }
  .container {
    display: flex;
    height: 100%;
    flex-direction: column;
    .content {
      width: 100%;
      min-width: 1000px;
      height: 100%;
    }
    .header-name {
      font-size: 16px;
      font-weight: 500;
      padding-left: 24px;
    }
  }
  .el-loading-mask {
    background-color: rgba(0, 0, 0, .2)
  }
  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active {
    will-change: transform;
    transition: all 500ms;
    position: absolute;
  }
  .slide-right-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .slide-right-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .number-change {
    transform-origin: top left;
    animation: animations .5s ease forwards;
  }
  @keyframes animations {
    0% {
      transform: scale(0.5);
      margin-bottom: 2px;
    }
    50% {
      transform: scale(1);
      margin-bottom: 4px;
    }
    75% {
      transform: scale(1.5);
      margin-bottom: 6px;
    }
    100% {
      transform: scale(1);
      margin-bottom: 0px;
    }
  }
  .el-date-editor .el-range-separator {
    line-height: 21px;
  }
</style>

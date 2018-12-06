<template>
  <div class="header">
    <p class="menu"> <!-- @click="changeMenu" -->
      <!-- <img src="./../../static/image/menu.png" alt="" v-bind:class="{rotateImg:menuFlag}"> -->
    </p>
    <p class="head"><img src="./../../static/image/people.png" alt=""></p>
  </div>
</template>

<script>
  import headerProp from "./../assets/eventBut";
  export default {
    data() {
      return {
        menuFlag: false,
      }
    }
  }
</script>
<style lang="less">
  .header {
    width: 100%;
    min-width: 1000px;
    min-height: 58px;
    background-color: #fff;
    box-shadow: 2px 0 4px rgba(175, 175, 175, .5);
    display: flex;
    justify-content: space-between;
  }
  .header p {
    line-height: 30px;
  }
  .header p.menu img {
    display: inline-block;
    height: 14px;
    margin-left: 16px;
    cursor: pointer;
    margin-top: 21px;
  }
  .header p.menu img.rotateImg {
    transform: rotate(90deg);
  }
  .header p.head img {
    display: inline-block;
    height: 31px;
    margin-right: 16px;
    cursor: pointer;
    margin-top: 15px;
  }
</style>


<template>
  <div class="side-bar">
    <el-menu :default-active="defaultActive" :active="true" class="el-menu-vertical-demo" @select="handleSelect" @open="handleOpen" @close="handleClose" :collapse="isCollapse" text-color="#fff" active-text-color="#fff" router>
      <div v-for="(item,index) in $router.options.routes" :key="index" v-if="!item.hidden">
        <el-submenu :index="index+''" v-if="!item.leaf">
          <template slot="title">
            <img src="" alt="" class="side-icon">
          </template>
          <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path">
            {{child.name}}
          </el-menu-item>
        </el-submenu> 
        <el-menu-item  v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">
          <img src="./../../static/image/address.png" alt="" class="side-icon">
          <span slot="title">{{item.children[0].name}}</span>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
  import headerProp from "./../assets/eventBut";
  export default {
    computed: {
      defaultActive: function() {
        return this.$route.path.replace('', '');
      }
    },
    data() {
      return {
        isCollapse: false
      }
    },
    methods: {
      handleSelect(key, keyPath) {
      },
      handleOpen: function() {
      },
      handleClose: function() {
      },
    },
    mounted() {
      const that = this;
      headerProp.$on("headClose", function(msg) {
        that.isCollapse = msg;
      })
    }
  }
</script>

<style>
  .side-icon {
    width: 24px;
    height: 24px;
    margin-right: 18px;
  }
  .side-bar .el-menu-vertical-demo {
    background-color: #32404f
  }
  .side-bar .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 175px;
    min-height: 400px;
  }
  .side-bar .el-menu {
    border-right: none;
    background-color: #32404f
  }
  .side-bar .el-menu-item:hover {
    background-color: #2c3845
  }
  .side-bar .el-submenu__title:hover {
    background-color: #2c3845
  }
  .side-bar .el-menu-item {
    padding: 0 40px;
    background: #2c3845;
  }
  .side-bar .el-submenu__title {
    padding-right: 40px;
  }
  .side-bar .el-submenu__icon-arrow {
    right: 36px;
  }
  .side-bar .el-menu .el-menu-item.is-active {
    background: #2c3845;
  }
  .side-bar .el-menu .el-menu-item.is-active::before, .side-bar .el-menu-item::before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: #32c39a;
  }
</style>
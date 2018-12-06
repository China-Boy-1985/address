import Vue from 'vue'
import Router from 'vue-router'
const Home = resolve => require(['@/components/container'], resolve)
const home = resolve => require(['@/biz/home/index'], resolve)

Vue.use(Router)

export default new Router({
  mode: 'history',  // 去掉路由地址的#
  routes: [
    {path: '/home', name: '', component: Home,leaf: true,//只有一个节点
      children: [
        { path: '/index/:id', component: home, name: '地址质检'}
      ]
    }
  ]
})

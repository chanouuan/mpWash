// components/tabbar/tabbar.js
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabData:{
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: app.globalData.tabHeight,
    tabList:[
      {
        key:1,
        name:'找车位',
        defIcon:'../../images/find_default.png',
        actIcon:'../../images/find_active.png',
        path:'/pages/index/index'

      },
      {
        key: 2,
        name: '车位管理',
        defIcon: '../../images/mange_default.png',
        actIcon: '../../images/mange_active.png',
        path: '/pages/parkmange/parkmange'
      },
      {
        key: 3,
        name: '我的',
        defIcon: '../../images/mine_default.png',
        actIcon: '../../images/mine_active.png',
        path: '/pages/mine/mine'
      },
    ],
  },
  /**
   * 生命周期
   */
  lifetimes:{
    attached(){
      let routeArr = getCurrentPages()
      let currentRoute = routeArr[routeArr.length - 1].route
        this.setData({
          currentRoute: currentRoute,
        })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleCheckoutTab(e){
      let currentRoute ='/'+ this.data.currentRoute
      let beforeRoute = this.data.beforeRoute
      let act_tab = e.currentTarget.dataset.select
      if (currentRoute == act_tab.path){
        return
      }else{
        wx.switchTab({
          url: act_tab.path,
        })
      }
      
    }
  }
})

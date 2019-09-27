// components/navbar/index.js
const app = getApp()
const utils = require('../../utils/utils.js')
Component({
  properties: {
    navbarData: { //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {},
    },
    goPath: {
      type: 'string'
    }
  },
  data: {
    height: '',
    //默认值  默认显示左上角
    navbarData: {
      backFlag: true,

    }
  },
  attached: function() {
    // 获取是否是通过分享进入的小程序
    this.setData({
      share: app.globalData.share
    })
    // 定义导航栏的高度   方便对齐
    this.setData({
      height: app.globalData.height
    })
  },
  methods: {
    // 返回上一页面
    _navback() {
      wx.navigateBack()
    },
    //返回到首页
    _backhome() {
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }
  }

})
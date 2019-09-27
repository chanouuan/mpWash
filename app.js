import api from './api/api.js'
App({
  onLaunch: function(options) {
    //wx.clearStorage() //清空缓存
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败

    })
    api.getCarBrand().then(res => {
      let brandList = res.result
      wx.setStorage({
        key: 'brandList',
        data: brandList,
      })

    })
    
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.statusBarHeight
        this.globalData.tabHeight = res.screenHeight - res.windowHeight
      }
    })
  },
  globalData: {
    share: false, // 分享默认为false
    height: 0,
  }

})
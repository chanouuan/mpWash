// components/shopcard/shopcard.js
const fetch = require('../../utils/utils.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shopProfile: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
 * 确认授权
 */
    confirmAuth(e) {
      let encryptedData = e.detail.encryptedData;
      let iv = e.detail.iv;
      wx.showLoading({
        title: '加载中',
      })
      wx.login({
        success: res => {
          if (res.code) {
            fetch.post('/parkWash/login', {
              encryptedData: encryptedData,
              iv: iv,
              code: res.code
            }).then(user => {
              if (user.errNo == 0) {
                fetch.setStorage('token', user.result.token)
                this.setData({
                  tel: user.result.telephone,
                  money: user.result.money,
                  authFlag: false
                }, () => {
                  wx.showTabBar({

                  })
                  wx.hideLoading()
                  wx.showToast({
                    title: '授权成功',
                    icon: 'none'
                  })
                })
              } else {
                this.setData({
                  authFlag: false
                }, () => {
                  wx.showTabBar({})
                  wx.showToast({
                    title: user.message,
                    icon: 'none'
                  })
                  wx.hideLoading()
                })

              }
            })
          }
        },
        fail: err => {
          wx.showToast({
            title: err,
          })
        },
        timeout: 10000
      })
    },

    /**
     * 取消授权
     */
    cancelAuth() {
      this.setData({
        authFlag: false
      }, () => {
        wx.showTabBar({})
      })
    },
    
    handlePlaceOrder() {
      let storeinfo = this.data.shopProfile
      wx.navigateTo({
        url: '/pages/placeorder/placeorder?storeinfo=' + JSON.stringify(storeinfo),
      })
     
     
    },
    /**
     * 导航
     */
    navToLocal() {
      const locainfo = this.data.shopProfile
      let lat = locainfo.location.split(',')[1]
      let lon = locainfo.location.split(',')[0]
      wx.openLocation({
        latitude: Number(lat),
        longitude: Number(lon),
        name: locainfo.store_name
      })
    },
    
  }
})
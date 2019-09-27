// pages/washvip/washvip.js
const app = getApp()
const fetch=require('../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.height,
    navbarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '洗车VIP', //导航栏 中间的标题
      indexFlag: true, //是否有背景
    },
    cardList: [],
    selectedId:''
  },
  //选择车辆
  handleSelectedCar(){
    fetch.setStorage('selectFlag', 'washvip').then(res => {
      wx.redirectTo({
        url: '/pages/carmange/carmange',
      })
    }).catch(err => {
    })
  },
  //选择会员卡
  handleSlectedCard(e){
    let id=e.currentTarget.dataset.card.id;
    let money = e.currentTarget.dataset.card.price;
    let days = e.currentTarget.dataset.card.duration;
    this.setData({
      selectedId:id,
      money:money,
      days: days
    })
  },
  //买卡
  handleBuyVip(){
    let car_number = this.data.carinfo ? this.data.carinfo.car_number:'';
    let card_type_id=this.data.selectedId
    this.setData({
      canPay: false
    })
    // fetch.post('/parkWash/renewalsCard', { car_number, card_type_id, payway:'cbpay'}).then(res=>{
    //   fetch.post('/parkWash/payQuery', { tradeid: res.result.tradeid }).then(flag => {
    //     if (flag.errNo == 0) {
    //       wx.showToast({
    //         title: '购买成功',
    //         icon: 'none'
    //       })
    //       setTimeout(() => {
    //         wx.switchTab({
    //           url: '/pages/mine/mine',
    //         })
    //       }, 1000)
    //     } else {
    //       wx.showToast({
    //         title: res.message,
    //         icon: 'none'
    //       })
    //     }
    //   })
    fetch.post('/parkWash/renewalsCard', { car_number, card_type_id, payway: 'wxpaywash' }).then(res => {
      if(res.errNo==0){
        let tradeid = res.result.tradeid;
        fetch.post('/wxpaywash/api', { tradeid}).then(res1=>{
          if(res.errNo==0){
            let wxparam = res1.result
            wx.requestPayment({
              timeStamp: wxparam.timestamp,
              nonceStr: wxparam.nonceStr,
              package: wxparam.package,
              signType: wxparam.signType,
              paySign: wxparam.paySign,
              success: pay => {
                if (pay.errMsg == "requestPayment:ok") {
                  fetch.post('/parkWash/payQuery', {
                    tradeid: res.result.tradeid
                  }).then(flag => {
                    if (flag.errNo == 0) {
                      wx.showToast({
                        title: '购买成功',
                        icon: 'none'
                      })
                      wx.removeStorageSync('license_list')
                      setTimeout(()=>{
                        wx.switchTab({
                          url: '/pages/mine/mine',
                        })
                      },1000)
                    } else {
                      wx.showToast({
                        title: flag.message,
                        icon: 'none'
                      })
                    }
                  })
                }
              },
              fail: err => {
                if (err.errMsg == "requestPayment:fail cancel") {
                  this.setData({
                    canPay: true
                  })
                  wx.showToast({
                    title: '取消支付',
                    icon: 'none'
                  })
                }
                console.log(err)
              }
            })
          }else{
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      }else{
        wx.showToast({
          title: res.message,
          icon:'none'
        })
      }
    })
  },
  //去卡包
  handleGoPackage(){
    wx.navigateTo({
      url: '/pages/cardpackage/cardpackage',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    fetch.removeStorage('selectFlag')
    let licenseList = wx.getStorageSync('license_list') || [];
    if (licenseList.length > 0) {
      let carinfo = licenseList.filter(item => item.isdefault)[0]
      this.setData({
        carinfo: carinfo,
      })
    } else {
      fetch.post('/parkWash/getCarport').then(res => {
        let carinfo = res.result;
        if (carinfo.length > 0) {
          fetch.setStorage('license_list', carinfo).then(res1 => {
            carinfo = carinfo.filter(item => item.isdefault)[0]
            this.setData({
              carinfo: carinfo
            })
          })
        }

      })
    }
    fetch.post('/parkWash/getCardTypeList').then(res=>{
      if(res.errNo==0){
        let data = res.result
        this.setData({
          cardList: data,
          selectedId: data[0].id,
          money: data[0].price,
          days: data[0].duration
        },()=>{
          wx.hideLoading()
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
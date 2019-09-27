// pages/mine/minde.js
const api = require('../../api/api.js')
const app = getApp()
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'
const utils = require('../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarData: { //导航栏
      backFlag: false,
      title: '',
      homeFlag: true,
      bgFlag: true
    },
    height: app.globalData.height,
    userinfo: '',
    tel: '',
    money: '',
    authModalFlag: false
  },
  /**
   * 绑定手机/打开登录弹窗
   */
  bindPhone(e) {
    this.setData({
      authModalFlag: true
    })
  },
  /**
   * 关闭登录弹窗
   */
  handleCloseModal() {
    this.setData({
      authModalFlag: false
    })
  },
  /**
   * 绑定成功
   */
  async handleBindOk() {
    let userinfo = wx.getStorageSync('userinfo')
    this.setData({
      userinfo: userinfo
    })
  },
  //去买卡
  // handleGoBuyVip(){
  //   if (this.data.tel) {
  //     wx.navigateTo({
  //       url: '/pages/washvip/washvip',
  //     })
  //   } else {
  //     this.setData({
  //       authFlag: true
  //     }, () => {
  //       wx.hideLoading()
  //       wx.hideTabBar({})
  //     })
  //   }

  // },
  /**
   * 拨打客服电话
   */
  customeCall() {
    wx.makePhoneCall({
      phoneNumber: '400-888-3126' //
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
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
  onShow: async function() {
    let userinfo = wx.getStorageSync('userinfo') || ''
    let token = wx.getStorageSync('token') || ''
    if (userinfo && token) {
      this.setData({
        userinfo: userinfo,
        pageFlag: true
      }, () => {
        wx.hideLoading()
      })
    } else if (token && !userinfo) {
      let userinfo = await api.getUserInfo()
      this.setData({
        userinfo: userinfo.result,
        pageFlag: true
      }, () => {
        wx.hideLoading()
        wx.setStorageSync('userinfo', userinfo.result)
      })
    } else {
      this.setData({
        pageFlag: true
      }, () => {
        wx.hideLoading()
      })
    }

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

  },

  /**
   * 打开消息
   */
  handleOpenMessage() {

  },
  /**
   * 洗车卡充值
   */
  handleCharge() {
    wx.navigateTo({
      url: '/pages/recharge/recharge',
    })
  },
  /**
   * 查看优惠券
   */
  handleLookCoupon() {
    wx.showToast({
      title: '该功能暂未开放',
      icon: 'none'
    })
  },
  /**
   * 车辆管理
   */
  handleCarMange() {
    wx.navigateTo({
      url: '/pages/carmange/carmange',
    })
  },
  /**
   * 洗车记录
   */
  handleWashRecord() {
    wx.navigateTo({
      url: '/pages/washrecord/washrecord',
    })
  },
  /**
   * 关于我们
   */
  handleAbout() {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  /**
   * 去停车小程序
   */
  handleGoParkMini() {
    wx.navigateToMiniProgram({
      appId: 'wx886d0a802470c414',
      path: 'pages/index/index',
      envVersion: 'release',
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }

    })
  },
  /**
   * 去共享小程序
   */
  handleGoShareMini() {
    wx.navigateToMiniProgram({
      appId: 'wxec6d9bb5e9b002dd',
      path: 'pages/index/index',
      envVersion: 'release',
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }

    })

  }
})
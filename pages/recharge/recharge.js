// pages/recharge/recharge.js
const api = require('../../api/api.js')
const app = getApp()
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'
const utils = require('../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.height,
    navbarData: { //导航栏
      backFlag: true,
      title: '余额充值',
    },
    chargeList: [30, 50, 100],
    canPay: true,
    userinfo: '',
    chargeMoney: '',
    agreeFlag: false,
  },
  /**
   * 打开协议
   */
  handleAgreement() {
    this.setData({
      agreeFlag: true
    })
  },
  /**
   * 同意协议
   */
  agreeThisAgreement() {
    this.setData({
      agreeFlag: false,
      agree: true
    })
  },
  /**
   * 关闭协议
   */
  handleCloseAgree(e) {
    let flag = e.currentTarget.dataset.flag
    if (flag == 'true') {
      this.setData({
        agreeFlag: false,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    wx.showLoading({
      title: '加载中',
    })
    let card_type = await api.getRechargeCardType()
    let userinfo = wx.getStorageSync('userinfo')
    if (userinfo) {
      this.setData({
        userinfo: userinfo,
        carTypeList: card_type.result,
        chargeMoney: card_type.result[0]
      }, () => {
        wx.hideLoading()
      })
    } else {
      let userinfo = await api.getUserInfo()
      this.setData({
        userinfo: userinfo.result,
        carTypeList: card_type.result,
        chargeMoney: card_type.result[0]
      }, () => {
        wx.hideLoading()
        wx.setStorageSync('userinfo', userinfo.result)
      })
    }


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

  },
  /**
   * 选择充值
   */
  handleSelectCharge(e) {
    let info = e.currentTarget.dataset.info
    this.setData({
      chargeMoney: info
    })
  },
  /**
   * 设置其他金额
   */
  handleSetOtherMoney(e) {
    let money = e.detail.value;
    this.setData({
      chargeMoney: money
    })

  },
  /**
   * 填写推荐人
   */
  handleEnterPromo(e) {
    let value = e.detail.value;
    this.setData({
      p_man: value
    })
  },
  /**
   * 看协议
   */
  handleLookAgree() {
    wx.navigateTo({
      url: '/pages/agreement/agreement',
    })
  },
  /**
   * 验证推荐人
   */
  async authPman() {
    this.setData({
      canPay: false
    }, () => {
      wx.showLoading({
        title: '加载中',
      })
    })
    let promo_name = this.data.p_man;
    let {
      result
    } = await api.authPman({
      query: {
        promo_name
      }
    })
    if (result.status == 0 && promo_name) {
      wx.hideLoading()
      wx.showModal({
        content: '推荐人不存在，是否继续充值',
        confirmText: '继续',
        confirmColor: '#5BDE82',
        success: res => {
          if (res.confirm) {
            wx.showLoading({
              title: '加载中',
            })
            this.handleRecharge()
          } else {
            this.setData({
              canPay: true
            }, () => {
              wx.hideLoading()
            })
          }
        }
      })
    } else {
      this.handleRecharge(promo_name)

    }
  },
  /**
   * 充值
   */
  async handleRecharge(promo_name) {


    let type_id = this.data.chargeMoney.id
    let payFlag = await api.rechargeMoney({
      query: {
        type_id,
        payway: 'wxpaywash',
        promo_name
      }
    })
    if (payFlag.errMsg == 'requestPayment:ok') { //支付成功
      let userinfo = await api.getUserInfo()
      this.setData({
        userinfo: userinfo.result,
        canPay: true,
      }, () => {
        wx.setStorageSync('userinfo', userinfo.result)
        wx.hideLoading()
        wx.showToast({
          title: '充值成功',
          icon: 'none'
        })
      })
    } else if (payFlag.errMsg == 'requestPayment:fail cancel') { //取消支付
      this.setData({
        canPay: true,
      }, () => {
        wx.hideLoading()
        wx.showToast({
          title: '取消充值',
          icon: 'none'
        })
      })
    } else { //支付失败
      this.setData({
        canPay: true,
      }, () => {
        wx.hideLoading()
        console.log(payFlag.errMsg)
        wx.showToast({
          title: '充值失败',
          icon: 'none'
        })
      })
    }

  },
  /**
   * 去看记录
   */
  handleTradeList() {
    wx.navigateTo({
      url: '/pages/tradelist/tradelist',
    })
  }
})
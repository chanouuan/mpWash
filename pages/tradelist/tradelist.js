// pages/tradelist/tradelist.js
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
      backFlag: true,
      title: '充值记录',
    },
    height: app.globalData.height,
   
    list: [],
    page: 0
  },
  /**
   * 获取记录
   */
  async getTradeList(page) {
    page = page===0?page: parseFloat(this.data.page);
    if (isNaN(page) ) {
      wx.showToast({
        title: '已加载完毕',
        icon:'none'
      })
      return
    } else {
      let data = await api.getTradeList({
        query: {
          lastpage: page
        }
      })
      let list = this.data.tradeList;
      if (page === 0) {
        this.setData({
          tradeList: data.result.list,
          page: data.result.lastpage
        }, () => {
          wx.hideLoading()
          wx.stopPullDownRefresh()
        })
      } else {
        list = list.concat(data.result.list)
        this.setData({
          tradeList: list,
          page: data.result.lastpage
        }, () => {
          wx.hideLoading()
        })
      }
    }


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getTradeList(0)

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
    wx.showLoading({
      title: '加载中',
    })
    this.getTradeList(0)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getTradeList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
// pages/carmange/carmange.js
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
      title: '车辆管理'
    },
    height: app.globalData.height,
    licenseList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    wx.showLoading({
      title: '加载中',
    })
  },
  /**
   * 编辑车辆
   */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function() {
    let carList = await api.getCarList()
    this.setData({
      licenseList: carList.result,
      pageFlag: true
    }, () => {
      wx.hideLoading()
    })
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
   * 新增车辆
   */
  handleCarProfile() {
    wx.navigateTo({
      url: '/pages/carinfo/carinfo',
    })
  },
  /**
   * 删除车辆
   */
  deleteCar(e) {
    let id = e.detail.id;
    let list = this.data.licenseList;
    let index=list.findIndex(item=>item.id==id)
    wx.showModal({
      content: '确定要删除该车辆么？',
      confirmText: '删除',
      confirmColor: "#1FD390",
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除',
          })
          api.deleteCar({
            query: {
              id: id
            }
          }).then(res => {
            if (res.errNo == 0) {
              list.splice(index,1)
              this.setData({
                licenseList:list
              },()=>{
                wx.hideLoading()
                wx.showToast({
                  title: '删除成功',
                  icon:'none'
                })
              })
            } else {
              wx.showToast({
                title: res.message,
                icon: 'none'
              })
            }
          })
        } else {

        }
      }
    })
  }
})
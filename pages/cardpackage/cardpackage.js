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
      title: '我的卡包', //导航栏 中间的标题
      indexFlag: true, //是否有背景
    },
  },
  //购买卡
  handleGoBack(){
    wx.navigateBack()
  },
  //删除卡
  handleDeleteVip(e){
    let id=e.detail.id
    wx.showModal({
      content: '确认要删除该会员卡吗',
      confirmText: '删除',
      confirmColor: "#1FD390",
      success: res => {
        if (res.confirm) {
          fetch.post('/parkWash/deleteMemberCard', { id }).then(res => {
            if (res.errNo == 0) {
              wx.showToast({
                title: '删除成功',
                icon: 'none'
              })
              fetch.post('/parkWash/getCardList').then(res => {
                if (res.errNo == 0) {
                  let data = res.result;
                  this.setData({
                    myCardList: data
                  })

                } else {
                  wx.showToast({
                    title: res.message,
                    icon: 'none'
                  })
                }
              })
            } else {
              wx.showToast({
                title: res.message,
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    fetch.post('/parkWash/getUserInfo').then(res=>{
      this.setData({
        tel: res.result.telephone
      })
    })
    fetch.post('/parkWash/getCardList').then(res=>{
      if(res.errNo==0){
        let data=res.result;
        this.setData({
          myCardList:data
        },()=>{
          wx.hideLoading()
        })

      }else{
        wx.showToast({
          title: res.message,
          icon:'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
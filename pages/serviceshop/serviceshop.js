// pages/serviceshop/serviceshop.js
const fetch=require('../../utils/utils.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '服务店', //导航栏 中间的标题
      indexFlag: false, //是否有背景
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height,
    tabList: [{
      key: 1,
      value: "洗车服务店"
    }, {
      key: 2,
      value: "自助洗车机"
    }],
    tab_act:1,
    storeList:[
    ],
    machineList:[
    ],


  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.getLocation({
      success: res => {
        fetch.getStorage('adcode').then(adcode => {
          this.setData({
            lat: res.latitude,
            lng: res.longitude,
            adcode: adcode
          }, () => {
            this.getWashStoreList("").then(res1 => {
              this.setData({
                s_page: res1.result.lastpage,
                storeList: res1.result.list
              }, () => {
              })
            })
            this.getWashMachineList("").then(res1 => {
              this.setData({
                m_page: res1.result.lastpage,
                machineList: res1.result.list
              })
            })
          })
        })


      },
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
    
    wx.getLocation({
      success: res=> {
        fetch.getStorage('adcode').then(adcode=>{
          this.setData({
            lat: res.latitude,
            lng: res.longitude,
            adcode:adcode
          }, () => {
            this.getWashStoreList("").then(res1 => {
              this.setData({
                s_page: res1.result.lastpage,
                storeList: res1.result.list
              }, () => {
                wx.hideLoading()
                wx.stopPullDownRefresh()
              })
            })
            this.getWashMachineList("").then(res1 => {
              this.setData({
                m_page: res1.result.lastpage,
                machineList: res1.result.list
              })
            })
            let token = wx.getStorageSync('token')
            let order_commit = wx.getStorageSync('order_commit') 
            order_commit = typeof order_commit == 'boolean' ? order_commit : true
            if (token) {
              fetch.post('/parkWash/getLastOrderInfo').then(res => {
                this.setData({
                  act_order: res.result,
                  order_commit: order_commit
                })
              })
            }
          })
        })
        
       
      },
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
    wx.showLoading({
      title: '加载中',
      icon: 'none'
    })
    if (this.data.tab_act == 1) {
      this.getWashStoreList("").then(res1 => {
        this.setData({
          s_page: res1.result.lastpage,
          storeList: res1.result.list,
        }, () => {
          wx.hideLoading()
          wx.stopPullDownRefresh()
        })
      })
    }else{
      this.getWashMachineList("").then(res1 => {
        this.setData({
          m_page: res1.result.lastpage,
          machineList: res1.result.list
        }, () => {
          wx.hideLoading()
          wx.stopPullDownRefresh()
        })
      })
    }
   
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if(this.data.tab_act==1){
      if(this.data.s_page===""){
        wx.showToast({
          title: '已加载完毕',
          icon:'none'
        })
        return
      }
      this.getWashStoreList(this.data.s_page).then(res1 => {
        this.setData({
          s_page: res1.result.lastpage,
          storeList: this.data.storeList.concat(res1.result.list),
        })
      })
    }else{
      if (this.data.m_page === "") {
        wx.showToast({
          title: '已加载完毕',
          icon: 'none'
        })
        return
      }
      this.getWashMachineList(this.data.m_page).then(res1 => {
        this.setData({
          m_page: res1.result.lastpage,
          machineList: this.data.machineList.concat(res1.result.list)
        })
      })
    }
   
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 切换tab
   */
  handleTab(e){
    let act=e.currentTarget.dataset.act
    this.setData({
      tab_act:act
    })
  },
  /**
   * 获取洗车店列表
   */
  getWashStoreList(page){
    return fetch.post('/parkWash/getStoreList', {adcode:this.data.adcode,lat:this.data.lat,lon:this.data.lng,lastpage:page})
    
  },
  /**
   * 获取洗车机列表
   */
  getWashMachineList(page){
    return fetch.post('/parkWash/getXicheDeviceList', { adcode: this.data.adcode, lat: this.data.lat, lon: this.data.lng, lastpage: page})
  },
  /**
 * 跳转订单页
 */
  handleGoProfile(e) {
    fetch.setStorage('order_path','serviceshop')
    let id = e.currentTarget.dataset.order_id;
    wx.navigateTo({
      url: '/pages/orderprofile/orderprofile?order_id=' + id,
    })
  }
})
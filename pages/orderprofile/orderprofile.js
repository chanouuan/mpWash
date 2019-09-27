// pages/orderprofile/orderprofile.js
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
      title: '订单详情',
    },
    placeFlag: false,
    index: '',
    park_num: '',
    areainfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    let token = wx.getStorageSync('token')
    
    
    let order_id = options.order_id;
    let profile = await api.getOrderProfile({
      query: {
        orderid: order_id
      }
    })
    let res = await api.getParkAreaList({
      query: {
        store_id: profile.result.store_id
      }
    })
    let pikerList = res.result;
    pikerList = pikerList.map(item => {
      item.allname = item.floor + ' ' + item.name
      return item
    })
    this.setData({
      orderProfile: profile.result,
      pageFlag: true,
      areaList: pikerList,
    })
  },
  /**
   * 选择区域
   */
  handleSelectArea(e) {
    let list=this.data.areaList;
    let index=e.detail.value
    let areainfo=list[index]
    this.setData({
      areainfo: areainfo
    })
  },
  handleParkNum(e) {
    this.setData({
      park_num: e.detail.value
    })
  },
  handleClosePlaceMoadl() {
    this.setData({
      placeFlag: false
    })
  },
  handleShowPlaceModal() {
    this.setData({
      placeFlag: true
    })
  },
  /**
   * 修改订单车位
   */
  async handleSubmitPlace() {
    let area_id=this.data.areainfo.id;
    let areainfo=this.data.areainfo
    let profile=this.data.orderProfile;
    let orderid=this.data.orderProfile.id;
    let place=this.data.park_num;
    let res = await api.updateParkArea({
      query:{
        area_id, orderid, place
      }
    })
    console.log(res)
    if (res) {
      profile = { ...profile, area_floor: areainfo.floor, area_name: areainfo.name,place:place}
      this.setData({
        orderProfile: profile
      },()=>{
        wx.showToast({
          title: '添加成功',
          icon: 'none'
        })
        this.handleClosePlaceMoadl()
      })
    }
    
  },
  /**
   * 取消订单
   */
  handleCancelOrder() {
    wx.showModal({
      content: '确定要取消该订单么？',
      confirmText: '取消订单',
      confirmColor: "#1FD390",
      cancelText: '不取消',
      cancelColor: '#AAA',
      success: res1 => {
        if (res1.confirm) {
          api.cancelOrder({query:{
            orderid: this.data.orderProfile.id
          }}).then(res => {
            if (res.errNo == 0) {
              api.getUserInfo().then(userinfo => {
                userinfo = userinfo.result
                wx.setStorageSync('userinfo', userinfo.result)
                  wx.navigateBack({
                    success:()=>{
                      wx.showToast({
                        title: '取消成功',
                        icon: 'none'
                      })
                    }
                  })
              })
            }
          })
        }
      }
    })

  },
  /**
   * 确认完成
   */
  async handleOnOrder() {
    let orderid=this.data.orderProfile.id
    let res = await api.orderConfirm({query:{
      orderid
    }})
    if(res){
      wx.showToast({
        title: '感谢您的使用，欢迎下次光临',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack({
        })
      },1000)
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
   * 导航
   */
  navToLocal() {
    const locainfo = this.data.orderProfile
    let lat = locainfo.location.split(',')[1]
    let lon = locainfo.location.split(',')[0]
    wx.openLocation({
      latitude: Number(lat),
      longitude: Number(lon),
      name: locainfo.store_name
    })
  },
  /**
   * 关闭warn弹窗
   */
  handleCloseWarnMoadl() {
    this.setData({
      warnFlag: false
    })
  }
})
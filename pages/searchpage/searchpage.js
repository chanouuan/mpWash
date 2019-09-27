const api = require('../../api/api.js')
const app = getApp()
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'
const utils = require('../../utils/utils.js')
var amapFile = require('../../utils/amap-wx.js');
const config = require('../../config.js')
var myAmapFun = new amapFile.AMapWX({
  key: config.geoKey
});
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.height,
    tabHeight: app.globalData.tabHeight,
    navbarData: { //导航栏
      title: '搜索',
      backFlag:true
    },
    focus:false,
    storeList:[],
    latitude:'',
    longitude:'',
    lastpage:0
  },
  /**
   * 获取洗车店-列表
   */
  getStoreList(lastpage) {
    let lat = this.data.latitude;
    let lon = this.data.longitude
    let list = this.data.storeList
    api.getWashStoreList({
      query: {
        adcode: 520100,
        lon: lon,
        lat: lat,
        lastpage
      }
    }).then(store => {
      this.setData({
        storeList: list.concat(store.result.list),
        lastpage: store.result.lastpage
      },()=>{
        wx.hideLoading()
      })
    })
  },
  /**
   * 搜索
   */
  handleSearch(e){
    let keywords=e.detail.value;
    console.log(keywords)
    if(keywords.length<=0){
      this.setData({
        searchList: []
      });
    }
    myAmapFun.getInputtips({
      keywords,
      city: 520100,
      success:data=>{
        if (data && data.tips) {
          this.setData({
            searchList: data.tips
          });
        }else{

        }
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  /**
   * 点击搜索列表项
   */
  handleSearchResult(e){
    wx.showLoading({
      title: '正在搜索',
    })
    let location=e.currentTarget.dataset.location;
    let [longitude, latitude]=location.split(',');
    this.setData({
      longitude, latitude,
      searchList:[],
      storeList: []
    },()=>{
      
      this.getStoreList(0)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {latitude,longitude} = options;
    this.setData({
      latitude,
      longitude,
    },()=>{
      this.getStoreList(0);
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 显示列表
   */
  
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
    this.getStoreList(0);
  },

  onReachBottom() {
    let lastpage = this.data.lastpage;
    if (lastpage === '') {
      wx.showToast({
        title: '已经没有啦',
        icon: 'none'
      })
      return
    } else {
      this.getStoreList(lastpage)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
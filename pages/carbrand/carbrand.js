// pages/carbrand/carbrand.js
import api from '../../api/api.js'
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'
const app = getApp()

function unflat(data) {
  let nav = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"];
  return nav.map(item => {
    return [data.filter(item1 => item1.pinyin == item)]
  }).filter(brand => brand[0].length !== 0)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.height,
    navbarData: { //导航栏
      backFlag: true,
      title: '车辆信息',
    },

    open: false,
    toView: 1,
    brandList: [],
    systemList: [],
  },
  /**
   * 字母定位
   */
  toView: function(e) {
    let i = parseInt(e.currentTarget.dataset.i);
    let word=e.currentTarget.dataset.word
    this.setData({
      toView: i,
      act_word: word,
    })
    this.timer=setTimeout(()=>{
      this.setData({
        act_word: '',
      },()=>{
        clearTimeout(this.timer)
      })
    },500)
  },
  // hideActWord(){
  //   console.log('xx')
  //     this.setData({
  //       act_word: '',
  //     })
  // },
  /**
   * 选中车辆品牌
   */
  handleSelectBrand(e){
    let info=e.currentTarget.dataset.brandinfo
    wx.setStorageSync('brand_info', info)
    wx.navigateBack({
      
    })
  },
  /**
   * 
   * 打开弹窗
   */
  goDetail: function(e) {
    let brand_id = e.currentTarget.dataset.id;
    let brand_name = e.currentTarget.dataset.name;
    fetch.setStorage('brand_info', {
      id: brand_id,
      name: brand_name
    }).then(res => {
      fetch.post('/parkWash/getSeriesList', {
        brand_id: brand_id
      }).then(res => {
        this.setData({
          systemList: res.result,
        }, () => {
          this.setData({
            open: true
          })
        })
      })
    })

  },
  /**
   * 关闭弹窗
   */
  handleCloseModal() {
    this.setData({
      open: false
    })
  },
  /**
   * 选择车系
   */
  handleSelectSystem(e) {
    let info = e.currentTarget.dataset.system_info;
    fetch.setStorage("system_info", info).then(res => {
      wx.redirectTo({
        url: '/pages/carinfo/carinfo'
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    api.getCarBrand().then(res => {
      let brandList = res.result
      console.log(res)
      let list = unflat(res.result)
      this.setData({
        brandList: list
      }, () => {
        wx.hideLoading()
      })
    })
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
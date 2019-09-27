// pages/carinfo/carinfo.js
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
      title: '车辆信息',
    },
    height: app.globalData.height,
    brand_info: '',
    // series_info: '',
    licenseList: [],
    keyboardFlag: false,
    brandList: [],
    // seriesList: [],
    car_number: '',
    carTypeInfo:'',
    carTypeList:[]
  },
  /**
   * 打开键盘
   */
  handleShowKeyboard() {
    this.setData({
      keyboardFlag: true
    })
  },
  /**
   * 关闭键盘
   */
  handleCloseKeyboard() {
    this.setData({
      keyboardFlag: false
    })
  },
  /**
   * 键盘组件中拿到车牌号
   */
  handleSetLicense(e) {
    let license_num = e.detail.license_num.join("")
    this.setData({
      car_number: license_num,
      licenseList: e.detail.license_num
    })
  },
  /**
   * 选择车品牌
   */
  async handleSelectCarBrand(e) {
    wx.navigateTo({
      url: '/pages/carbrand/carbrand',
    })
  },
  /**
   * 获取车型列表
   */
  async getCarType() {
    let {
      result
    } = await api.getCarType()
    this.setData({
      carTypeList: result
    })
  },
  /**
  * 选择车类型
  */
  handleSelectCarType(e) {
    let index = e.detail.value;
    let list = this.data.carTypeList;
    let info = list[index];
    this.setData({
      carTypeInfo: info
    })
  },
  // async handleSelectCarBrand(e) {
  //   let index = e.detail.value;
  //   let list = this.data.brandList;
  //   let info = list[index]
  //   let series = await api.getCarSeries({
  //     query: {
  //       brand_id: info.id
  //     }
  //   });
  //   this.setData({
  //     brand_info: info,
  //     seriesList: series.result,
  //     series_info: ''
  //   })
  // },
  /**
   * 选择车系时没选车品牌
   */
  // handleSetSeries(e) {
  //   if (e) {
  //     let flag = e.currentTarget.dataset.series;
  //     let list = this.data.seriesList
  //     if (flag && list.length <= 0) {
  //       wx.showToast({
  //         title: '请先选择车辆品牌',
  //         icon: 'none'
  //       })
  //     }
  //   }
  // },
  /**
   * 选择车系
   */
  // handleSelectCarSeries(e) {
  //   let index = e.detail.value;
  //   let list = this.data.seriesList;
  //   let info = list[index]
  //   this.setData({
  //     series_info: info
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    let carinfo = options.carinfo ? JSON.parse(options.carinfo) : ''
    // let brandList = wx.getStorageSync('brandList')
    // this.setData({
    //   brandList: brandList
    // })
    // let brandIndex = brandList.findIndex(item => item.id == carinfo.brand_id)
    // let series = await api.getCarSeries({
    //   query: {
    //     brand_id: carinfo.brand_id
    //   }
    // });
    // series = series.result
    // let seriesIndex = series.findIndex(item => item.id == carinfo.series_id)
    await this.getCarType()
    if (carinfo) {
      this.setData({
        car_number: carinfo.car_number,
        licenseList: carinfo.car_number.split(''),
        brand_info: { name: carinfo.brand_name, id: carinfo.brand_id},
        carTypeInfo: { name: carinfo.car_type_name, id: carinfo.car_type_id},
        // series_info: series[seriesIndex],
        // brandIndex,
        // seriesIndex,
        pageFlag: true,
        // seriesList: series,
        carinfo: carinfo
      })
    } else {
      this.setData({
        pageFlag: true
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
    let brandinfo = wx.getStorageSync('brand_info');
    if (brandinfo) {
      this.setData({
        brand_info: brandinfo
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
    wx.removeStorageSync('brand_info')
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
  // /**
  //  * 展示车系品牌
  //  */
  // showCarBrand(){
  //   wx.redirectTo({
  //     url: '/pages/carbrand/carbrand',
  //   })
  // },
  // /**
  //  * 新增车牌
  //  */
  // addLicense(){
  //   wx.redirectTo({
  //     url: '/pages/license/license',
  //   })
  // },
  /**
   * 确认新增/编辑
   */
  async handleSubmitAddLicense() {
    let car_number = this.data.car_number
    let brand_id = this.data.brand_info.id
    // let series_id = this.data.series_info.id
    let car_type_id=this.data.carTypeInfo.id;
    let carinfo = this.data.carinfo || '';
    if (carinfo) { //编辑
      let editFlag = await api.eritCar({
        query: {
          id: carinfo.id,
          car_number,
          brand_id,
          car_type_id
        }
      })
      if (editFlag) {
        wx.navigateBack({
          success:res=>{
            wx.showToast({
              title: '编辑成功',
              icon:'none'
            })
          }
        })
      }
    } else {
      let addFlag = await api.addCar({
        query: {
          car_number,
          brand_id,
          car_type_id
        }
      })
      if (addFlag) {
        wx.navigateBack({
          success: res => {
            wx.showToast({
              title: '添加成功',
              icon:'none'
            })
          }
        })
      }
    }

  },
  /**
   * 确认编辑
   */
  // handleSubmitEditLicense(){
  //   fetch.post('/parkWash/updateCarport', {
  //     id:this.data.license_id,
  //     car_number: this.data.license,
  //     brand_id: this.data.brand_info.id,
  //     series_id: this.data.system_info.id
  //   }).then(res => {
  //     if (res.errNo == 0) {
  //       fetch.removeStorage('license')
  //       fetch.removeStorage('brand_info')
  //       fetch.removeStorage('system_info')
  //       fetch.removeStorage('license_id')
  //       fetch.removeStorage('area_id').then(res => {
  //         fetch.post('/parkWash/getCarport').then(res => {
  //           fetch.setStorage('license_list', res.result).then(res1 => {
  //             wx.redirectTo({
  //               url: '/pages/carmange/carmange',
  //             })
  //           })
  //         })
  //       })
  //     } else {
  //       wx.showToast({
  //         title: res.message,
  //         icon: 'none'
  //       })
  //     }
  //   })
  // }
})
const api = require('../../api/api.js')
const app = getApp()
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'
const utils = require('../../utils/utils.js')
const filterDay = list => { //删选日期 fuck
  list = list.filter(item => item.amount > 0).map(item => item.today)
  return [...new Set(list)]
}
const filterTime = (list, day) => { //删选每天的时间段 fuck
  list = list.filter(item => item.today == day && item.amount > 0).map(item => item.start_time)
  return list
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.height,
    tabHeight: app.globalData.tabHeight,
    nvabarData: { //导航栏
      backFlag: true,
      title: '提交订单',
    },
    addFlag: false,
    storeinfo: "",
    authModalFlag: false,
    car_info: '', //选中的车辆信息
    carIndex: '',
    brand_info: '', //选中的车辆品牌信息
    // series_info: '', //选中的车系信息
    licenseList: [], //车辆列表
    keyboardFlag: false,
    // brandList: [], //车辆品牌列表
    // seriesList: [], //车系列表
    menu_list: [], //套餐列表
    menuinfo: '', //选中的套餐
    menuIndex: '',
    pool_list: [], //时段列表
    pool_picker_data: [], //时段picker数据
    timeIndex: '',
    area_list: [], //车位区域列表
    areainfo: '', //选中的车位区域信息,,
    areaIndex: '',
    timeinfo: '', //选中的时段信息
    canPay: true,
    carTypeList:[],//车型列表
    carTypeInfo:'',//选中的车类型
  },
  /**
   * 去充值
   */
  handleGoRecharge() {
    wx.navigateTo({
      url: '/pages/recharge/recharge',
    })
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
  handleCloseKeyboard(e) {
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
      carNumber: license_num,
      licenseList: e.detail.license_num
    })
  },
  /**
   * 选择车品牌
   */
  async handleSelectCarBrand(e) {
    // let index = e.detail.value;
    // let list = this.data.brandList;
    // let info = list[index]
    // let series = await api.getCarSeries({
    //   query: {
    //     brand_id: info.id
    //   }
    // });
    // this.setData({
    //   brand_info: info,
    //   seriesList: series.result,
    //   series_info: '',


    // })
    wx.navigateTo({
      url: '/pages/carbrand/carbrand',
    })
  },
  /**
   * 选择车类型
   */
  handleSelectCarType(e){
    let index=e.detail.value;
    let list=this.data.carTypeList;
    let info=list[index];
    this.setData({
      carTypeInfo:info
    })
  },
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
   * 切换添加车牌状态/添加车牌
   */
  async handleAddCar() {
    this.handleCloseKeyboard()
    let flag = this.data.addFlag
    if (flag) {
      let carNumber = this.data.carNumber
      let brand_id = this.data.brand_info.id
      // let series_id = this.data.series_info.id
      let car_type_id = this.data.carTypeInfo.id
      wx.showLoading({
        title: '正在添加',
      })
      let addFlag = await api.addCar({
        query: {
          car_number: carNumber,
          brand_id,
          car_type_id
        }
      })
      if (addFlag) {
        let carList = await api.getCarList()
        this.getWashMenu(carList.result[0].car_type_id)
        this.setData({
          addFlag: false,
          carList: carList.result,
          car_info: carList.result[0],
          carIndex: 0
        }, () => {
          wx.showToast({
            title: '添加成功',
            icon: 'none'
          })
        })
      }
    } else {
      this.setData({
        addFlag: true,
        keyboardFlag: true
      })
    }
  },
  /**
   * 取消添加
   */
  handleCancelAdd() {
    this.handleCloseKeyboard()
    this.setData({
      addFlag: false
    })
  },
  /**
   * 选择套餐
   */
  handleSelectMenu(e) {
    let index = e.detail.value
    let list = this.data.menu_list;
    this.setData({
      menuinfo: list[index],
      menuIndex: index
    })
  },
  /**
   * 选择车位区域
   */
  handleSelectArea(e) {
    let index = e.detail.value
    let list = this.data.area_list;
    this.setData({
      areainfo: list[index],
      areaIndex: index
    })
  },
  /**
   * 填写车位号
   */
  handleParkNum(e) {
    let place = e.detail.value;
    this.setData({
      place
    })
  },

  /**
   * 点击菜单
   */
  handleMenu() {
    if (this.data.carList.length <= 0) {
      wx.showToast({
        title: '请先确定添加您的车牌信息',
        icon: 'none'
      })
    } else {
      return
    }

  },
  /**
   * 设置时间段
   */
  handleSetTimeArr(e) {
    let col = e.detail.column
    let list = this.data.pool_picker_data;
    let pool_list = this.data.pool_list
    if (col == 0) {
      let index = e.detail.value
      list[1] = filterTime(pool_list, list[0][index])
      this.setData({
        pool_picker_data: list,
      })
    }
  },
  /**
   * 选择取车时间
   */
  handleSelectData(e) {
    let value = e.detail.value
    let data = this.data.pool_picker_data;
    let day = data[0][value[0]]
    let time = data[1][value[1]]
    let list = this.data.pool_list
    let info = list.filter(item => item.today == day).filter(item1 => item1.start_time == time)[0]
    this.setData({
      timeinfo: info,
      timeIndex: value
    })
  },
  /**
   * 点击取车时间
   */
  handleTime() {
    let pool_picker_data = this.data.pool_picker_data;
    if (pool_picker_data.length < 0) {
      wx.showToast({
        title: '暂无可预约的时段,请稍后再试',
        icon: 'none'
      })
    } else {
      return
    }
  },




  /**
   * 获取车位区域列表
   */
  async getParkAreaList() {
    let id = this.data.storeinfo.id
    let areaList = await api.getParkAreaList({
      query: {
        store_id: id
      }
    })
    let list = areaList.result.map(item => {
      item.floorname = item.floor + ' ' + item.name
      return item
    })
    this.setData({
      area_list: list
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
   * 获取套餐列表
   */
  async getWashMenu(car_type_id, store_id) {
    console.log(car_type_id)
    store_id = this.data.storeinfo.id || store_id
    let menu = await api.getWashMenu({
      query: {
        store_id,
        car_type_id
      }
    })
    let list = menu.result
    list = list.map(item => {
      item.nameprice = item.firstorder == 1 ? item.name + " " + item.price : item.name + " " + (item.price / 100).toFixed(2) + "元"
      item.price = (item.price / 100).toFixed(2) == 'NaN' ? item.price : (item.price / 100).toFixed(2)
      return item
    })
    this.setData({
      menu_list: list,
      menuIndex: '',
      menuinfo: ''
    })
  },
  /**
   * 获取排班列表
   */
  async getPoolList() {
    let store_id = this.data.storeinfo.id
    let poolList = await api.getPoolList({
      query: {
        store_id
      }
    })
    this.setData({
      pool_list: poolList.result,
      pool_picker_data: [filterDay(poolList.result), filterTime(poolList.result, poolList.result[0].today)]
    })
  },


  /**
   * 关闭弹窗
   */
  handleCloseModal(e) {
    let flag = e ? e.detail.flag : ''
    this.setData({
      authModalFlag: false
    }, () => {
      if (flag) {
        wx.navigateBack({})
      }
    })
  },
  /**
   * 绑定成功
   */
  async handleBindOk() {
    let carList = await api.getCarList()
    let userinfo = wx.getStorageSync('userinfo')
    this.setData({
      carList: carList.result,
      userinfo: userinfo,
      car_info: carList.result[0]
    })
  },
  /**
   *  选择车牌
   */
  handleChangeCar(e) {
    let index = e.detail.value
    let list = this.data.carList
    let car_info = list[index]
    this.setData({
      car_info,
      carIndex: index
    }, () => {
      this.getWashMenu(car_info.car_type_id)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {

    wx.showLoading({
      title: '加载中',
    })

    let storeinfo = JSON.parse(options.storeinfo)
    // let brandList = wx.getStorageSync('brandList')
    this.setData({
      storeinfo: storeinfo,
      // brandList: brandList
    })
    this.getPoolList()
    this.getParkAreaList()
    this.getCarType()
    let token = wx.getStorageSync('token') || ''
    if (token) {
      let carList = await api.getCarList()
      if (carList.result.length > 0) {
        this.getWashMenu(carList.result[0].car_type_id, storeinfo.id)
      }
      this.setData({
        carList: carList.result,
        car_info: carList.result.length > 0 ? carList.result[0] : '',
        carIndex: carList.result.length > 0 ? 0 : '',
        pageFlag: true,
      }, () => {
        wx.hideLoading()
      })
    } else {
      this.setData({
        pageFlag: true,
        authModalFlag: true
      }, () => {
        wx.hideLoading()
      })
    }

  },
  /**
   * 立即支付
   */
  async handlePayOrder(e) {
    this.setData({
      canPay: false
    })
    let store_id = this.data.storeinfo.id;
    let carport_id = this.data.car_info.id;
    let pool_id = this.data.timeinfo.id;
    let items = this.data.menuinfo.id;
    let area_id = this.data.areainfo.id;
    let addFlag = this.data.addFlag;
    let place = this.data.place;
    if (!addFlag) {
      let query = {
        store_id,
        carport_id,
        area_id,
        place,
        pool_id,
        items
      }
      var userinfo = wx.getStorageSync('userinfo')
      if (userinfo) {
        userinfo = userinfo
      } else {
        userinfo = await api.getUserInfo()
        wx.setStorageSync('userinfo', userinfo.result)
        userinfo = userinfo.result
      }
      let itemList = [`余额支付(剩余:${(userinfo.money / 100).toFixed(2)})`, '微信支付']

      let arr = Object.keys(e.detail.value)
      let flag = arr.map(item => {
        if (query[item] == '') {
          switch (item) {
            case 'carport_id':
              this.setData({
                canPay: true
              })
              wx.showToast({
                title: '请输入正确的车辆信息并确定添加',
                icon: 'none'
              })
              return false
              break;
            case 'pool_id':
              this.setData({
                canPay: true
              })
              wx.showToast({
                title: '请选择您的取车时间',
                icon: 'none'
              })
              return false
              break;
            case 'items':
              this.setData({
                canPay: true
              })
              wx.showToast({
                title: '请选择您要享受的项目',
                icon: 'none'
              })
              return false
              break;
            default:
              return true
          }
        } else {
          return true
        }
      }).every(item => item)
      if (flag) {
        wx.showActionSheet({
          itemList: itemList,
          itemColor: '#333',
          success: res => {

            api.payOrder({
              query: {
                ...query,
                payway: res.tapIndex == 0 ? 'cbpay' : 'wxpaywash'
              }
            }).then(payFlag => {
              if (payFlag.orderid) { //支付成功
                api.getUserInfo().then(userinfo => {
                  this.setData({
                    userinfo: userinfo.result,
                    pageFlag: false
                  }, () => {
                    wx.setStorageSync('userinfo', userinfo.result)
                    wx.hideLoading()
                    wx.redirectTo({
                      url: '/pages/index/index',
                      success: () => {
                        wx.showToast({
                          title: '支付成功',
                          icon: 'none',
                          duration: 3000
                        })
                      }
                    })

                  })
                })

              } else if (payFlag.errMsg == 'requestPayment:fail cancel') { //取消支付
                wx.hideLoading()

                wx.showToast({
                  title: '取消支付',
                  icon: 'none'
                })
              } else { //支付失败

                wx.hideLoading()
               
                wx.showToast({
                  title: '支付失败',
                  icon: 'none'
                })
              }
            })
          },
          complete: c => {
            this.setData({
              canPay: true
            })
          },
          fail: c => {
            console.log(c)
          }
        })

      } else {
        this.setData({
          canPay: true
        })
      }
    } else {
      this.setData({
        canPay: true
      })
      wx.showToast({
        title: '请输入正确的车辆信息并点击确定添加',
        icon: 'none'
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
    if(brandinfo){
      this.setData({
        brand_info:brandinfo
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

  }
})
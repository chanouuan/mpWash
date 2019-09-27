// pages/orderconfirm/confirm.js
const fetch = require('../../utils/utils.js')
const app = getApp()
const filterDay=list=>{
  list = list.filter(item => item.amount > 0).map(item => item.today)
  return [...new Set(list)]
}
const filterTime=(list,day)=>{
  list = list.filter(item=>item.today == day && item.amount > 0).map(item=>item.start_time)
  return list
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.height,
    navbarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '订单确认', //导航栏 中间的标题
      indexFlag: true, //是否有背景
    },
    park_num: '',
    dateIndex: '',
    index: '',
    payFlag: false,
    warnFlag:true,
    canPay:true,
    vipFlag:true,
    mealIndex:''
  },
  /**
   * 关闭支付弹窗
   */
  handleClosePayMoadl() {
    this.setData({
      payFlag: false
    })
  },
  handleCloseWarnMoadl(){
    this.setData({
      warnFlag:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    fetch.removeStorage('selectFlag')
    let licenseList = wx.getStorageSync('license_list') || [];
    if (licenseList.length>0) {
      let carinfo = licenseList.filter(item => item.isdefault)[0]
      this.setData({
        carinfo: carinfo,
        order_path:wx.getStorageSync('order_path')
      })
    } else {
      fetch.post('/parkWash/getCarport').then(res => {
       
        let carinfo = res.result;
        if(carinfo.length>0){
          fetch.setStorage('license_list', carinfo).then(res1 => {
            carinfo = carinfo.filter(item => item.isdefault)[0]
            this.setData({
              carinfo: carinfo
            })
          })
        }
        
      })

    }
    fetch.get('/parkWash/getParkArea').then(res => {
      let pikerList = res.result;
      pikerList = pikerList.map(item => {
        item.allname = item.floor + item.name
        return item
      })
      this.setData({
        areaList: pikerList,
      })
    })
    fetch.post('/parkWash/getPoolList', {
      store_id: wx.getStorageSync('store_id')
    }).then(res => {
      let data = res.result;
      let dayPicker = filterDay(data)
      let timeList = filterTime(data, dayPicker[0])
      this.setData({
        datePickerData: [dayPicker, timeList],
        dateList: res.result
      })
    })
    fetch.post('/parkWash/getStoreItem', {
      store_id: wx.getStorageSync('store_id')
    }).then(res => {
      this.setData({
        washmeal: res.result,
        price: '',
        meal_id: ''
      })
    })
    fetch.post('/parkWash/getUserInfo').then(res => {
      if (res.errNo == 0) {
        this.setData({
          money: res.result.money,
          firstorder: res.result.firstorder>0?true:false
        })
      } else {

      }
    })
    this.setData({
      park_num: wx.getStorageSync('wash_park_num') || '',
      dateIndex: wx.getStorageSync('wash_date_index') || '',
      index: wx.getStorageSync('wash_area_index') || '',
      mealIndex: wx.getStorageSync('meal_index') || '',
    })
  },
/**
 * 新增车辆
 */
  handleSelectWash() {
    fetch.setStorage('selectFlag', 'orderconfirm').then(res => {
      wx.redirectTo({
        url: '/pages/carmange/carmange',
      })
    }).catch(err => {
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

  },
  /**
   * 立即支付
   */
  handleShowPayModal(e) {
    this.setData({
      vipFlag:false
    })
    let firstorder=this.data.firstorder
    let isvip = this.data.carinfo ? this.data.carinfo.isvip:''
    let store_id = wx.getStorageSync('store_id') ? wx.getStorageSync('store_id') : ''
    let carport_id = this.data.carinfo ? this.data.carinfo.id : ''
    let area_id = wx.getStorageSync('wash_area_index') ? this.data.areaList[wx.getStorageSync('wash_area_index')].id : ''
    let place = this.data.park_num
    let day = wx.getStorageSync('wash_date_index') ? this.data.datePickerData[0][wx.getStorageSync('wash_date_index')[0]] : ''
    let time = wx.getStorageSync('wash_date_index') ? this.data.datePickerData[1][wx.getStorageSync('wash_date_index')[1]] : ''
    let dateInfo = wx.getStorageSync('wash_date_index') ? this.data.dateList.filter(item => item.today == day).filter(item => item.start_time == time)[0] : ''
    let items = this.data.meal_id
    if (isvip > 0 || firstorder) {
      fetch.post('/parkWash/createCard', {
        store_id,
        carport_id,
        area_id,
        place,
        pool_id: dateInfo.id,
        items,
        form_id:  e.detail.formId
      }).then(res => {
        if (res.errNo == 0) {
          fetch.post('/parkWash/payQuery', { tradeid: res.result.tradeid }).then(flag => {
            if (flag.errNo == 0) {
              fetch.setStorage('act_order', flag.result.orderid)
              wx.navigateTo({
                url: '/pages/orderprofile/orderprofile?order_id=' + flag.result.orderid + '&show_modal=true',
              })
            } else {
              this.setData({
                vipFlag: true
              })
              wx.showToast({
                title: res.message,
                icon: 'none'
              })
            }
          })
        } else {
          this.setData({
            vipFlag: true
          })
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }

      })
    } else {
      this.setData({ //支付弹窗
        payFlag: true,
        form_id: e.detail.formId
      })
    }
   

  },
  /**
   * 选择区域
   */
  handleSelectArea(e) {
    this.setData({
      index: e.detail.value
    }, () => {
      fetch.setStorage('wash_area_index', e.detail.value)
    })
  },
  handleSelectMeal(e){
    let meal = this.data.washmeal
    let index = e.detail.value
    this.setData({
      mealIndex: e.detail.value,
      price: meal[index].price,
      meal_id: meal[index].id
    }, () => {
      fetch.setStorage('meal_index', e.detail.value)
    })
  },
  /**
   * 填写车位号
   */
  handleParkNum(e) {
    this.setData({
      park_num: e.detail.value
    }, () => {
      fetch.setStorage('wash_park_num', e.detail.value)
    })
  },
  /**
   * 选择时间
   */
  handleSelectData(e) {
    this.setData({
      dateIndex: e.detail.value
    })
    fetch.setStorage('wash_date_index',  e.detail.value)
  },
  //设置小时
  handleSetTimeArr(e){
    let column = e.detail.column
    let key = e.detail.value
    let dateList=this.data.dateList;
    let pickerData=this.data.datePickerData;
    let dayList = this.data.datePickerData[0]
    if (column==0){
      let value=dayList[key]
      let list=filterTime(dateList,value)
      pickerData[1]=list
      this.setData({
        datePickerData: pickerData,
      })
    }
  },
  //关闭picker
  handleCancelPicker(e){
    let dateIndex=this.data.dateIndex
    if(dateIndex){
      this.setData({
        dateIndex:dateIndex
      })
    }else{
      this.setData({
        dateIndex: ''
      })
    }
   
  },
  /**
   * 支付
   */
  handlePay(e) {
    this.setData({
      canPay:false
    })
    let store_id = wx.getStorageSync('store_id') ? wx.getStorageSync('store_id') : ''
    let carport_id = this.data.carinfo ? this.data.carinfo.id:''
    let area_id = wx.getStorageSync('wash_area_index') ? this.data.areaList[wx.getStorageSync('wash_area_index')].id : ''
    let place = this.data.park_num
    let day = wx.getStorageSync('wash_date_index') ? this.data.datePickerData[0][wx.getStorageSync('wash_date_index')[0]] : ''
    let time = wx.getStorageSync('wash_date_index') ? this.data.datePickerData[1][wx.getStorageSync('wash_date_index')[1]] : ''
    let dateInfo = wx.getStorageSync('wash_date_index') ? this.data.dateList.filter(item => item.today == day).filter(item => item.start_time == time)[0] : ''
    let items = this.data.meal_id
    let payway=e.currentTarget.dataset.pay_type
    
      fetch.post('/parkWash/createCard', {
        store_id,
        carport_id,
        area_id,
        place,
        pool_id: dateInfo.id,
        items,
        payway,
        form_id: this.data.form_id
      }).then(res => {
        if (res.errNo == 0) {
          if (payway == 'cbpay') {
            fetch.post('/parkWash/payQuery', { tradeid: res.result.tradeid }).then(flag => {
              if (flag.errNo == 0) {
                fetch.setStorage('act_order', flag.result.orderid)
                wx.navigateTo({
                  url: '/pages/orderprofile/orderprofile?order_id=' + flag.result.orderid + '&show_modal=true',
                })
              } else {
                wx.showToast({
                  title: res.message,
                  icon: 'none'
                })
              }
            })
          } else {
            fetch.post('/wxpaywash/api', { tradeid: res.result.tradeid }).then(wxparam => {
              if (wxparam.errNo == 0) {
                let wxdata = wxparam.result
                wx.requestPayment({
                  timeStamp: wxdata.timestamp,
                  nonceStr: wxdata.nonceStr,
                  package: wxdata.package,
                  signType: wxdata.signType,
                  paySign: wxdata.paySign,
                  success: pay => {
                    if (pay.errMsg == "requestPayment:ok") {
                      fetch.post('/parkWash/payQuery', { tradeid: res.result.tradeid }).then(flag => {
                        if (flag.errNo == 0) {
                          fetch.setStorage('act_order', flag.result.orderid)
                          wx.navigateTo({
                            url: '/pages/orderprofile/orderprofile?order_id=' + flag.result.orderid + '&show_modal=true',
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
                  },
                  fail: err => {
                    this.setData({
                      canPay: true
                    })
                    wx.showToast({
                      title: '支付失败，请重新支付',
                      icon: 'none'
                    })
                  }
                })
              } else {
                this.setData({
                  canPay: true
                })
                wx.showToast({
                  title: res.message,
                  icon: 'none'
                })
              }
            })
          }
        } else {
          this.setData({
            canPay: true,
            vipFlag: true
          })
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }

      })
   
    // wx.navigateTo({
    //   url: '/pages/orderprofile/orderprofile?order_id=' + 10 + '&show_modal=true',
    // })
  }

})
// components/vipcard/vipcard.js
const fetch=require('../../utils/utils.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cardInfo:{
      type:Object
    },
    tel:{
      type:Number
    }
    
  },
  lifetimes:{
    attached() {
    },
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleGoAddVip(){
      let licenseList = wx.getStorageSync('license_list');
      licenseList = licenseList.map(item => {
        if (item.car_number == this.data.cardInfo.car_number) {
          item.isdefault = 1
        } else {
          item.isdefault = 0
        }
        return item
      })
      fetch.setStorage('license_list', licenseList).then(res => {
        wx.redirectTo({
          url: '/pages/washvip/washvip',
        })
      })
     
    },
    handleDeleteCard(){
      let id=this.data.cardInfo.id
      this.triggerEvent('deletecard', { id: id })
    }
  }
})

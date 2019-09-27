// components/carinfo/carinfo.js
const fetch=require('../../utils/utils.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    parkInfo:{
      type:Object
    }
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
    updateLicense(){
      // fetch.setStorage('brand_info',{
      //   id: this.data.parkInfo.brand_id,
      //   name:this.data.parkInfo.brand_name
      // })
      // fetch.setStorage('system_info', {
      //   id: this.data.parkInfo.series_id,
      //   name: this.data.parkInfo.series_name
      // })
      // fetch.setStorage('license_id', this.data.parkInfo.id)
      // fetch.setStorage('license', this.data.parkInfo.car_number)
      // fetch.setStorage('area_id', this.data.parkInfo.area_id).then(res=>{
      // })
      let carinfo=this.data.parkInfo
      wx.navigateTo({
        url: '/pages/carinfo/carinfo?carinfo=' + JSON.stringify(carinfo),
        })
    },
    handeleDeleteCar(){
      let id=this.data.parkInfo.id;
      this.triggerEvent('deletecar',{id:id})
    },
    // handleSelected(){
    //   let licenseList=wx.getStorageSync('license_list');
    //   licenseList = licenseList.map(item=>{
    //     if(item.id==this.data.parkInfo.id){
    //       item.isdefault=1
    //     }else{
    //       item.isdefault = 0
    //     }
    //     return item
    //   })
    //   fetch.setStorage('license_list', licenseList).then(res=>{
    //       wx.redirectTo({
    //         url: '/pages/' + wx.getStorageSync('selectFlag') + '/' + wx.getStorageSync('selectFlag'),
    //         success:res=>{
              
    //         }
    //       })
    //   }).catch(err=>{
    //     console.log(err)
    //   })
      
    // }
  }
})

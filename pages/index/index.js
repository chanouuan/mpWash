const api = require('../../api/api.js')
const app = getApp()
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'
const utils = require('../../utils/utils.js')
var amapFile = require('../../utils/amap-wx.js');
const config=require('../../config.js')
var myAmapFun = new amapFile.AMapWX({
  key: config.geoKey
});
//过滤洗车店
function filterStore(storeArr) {
  let noArr = storeArr.filter(item => item.status == 0)
  let actArr = storeArr.filter(item => item.status == 1)
  noArr = noArr.map(item => {
    item.latitude = item.location.split(',')[1];
    item.longitude = item.location.split(',')[0];
    item.width = 48;
    item.height = 70;
    item.iconPath = '/images/def_wash.png';
    return item
  })
  actArr = actArr.map(item => {
    item.latitude = item.location.split(',')[1];
    item.longitude = item.location.split(',')[0];
    item.width = 69;
    item.height = 96;
    item.iconPath = '/images/act_wash.png';
    return item
  })
  return [...actArr,...noArr]
}
//过滤洗车机
// function filterMachine(machineArr) {
//   let newArr = machineArr.map((item, index) => {
//     item.id = -index + (-1);
//     item.order_num = item.list.reduce((a, b) => b.order_count + a, 0)
//     item.state = item.list.every(item1 => item1.state == 0) ? 0 : 1
//     item.latitude = item.location.split(',')[1];
//     item.longitude = item.location.split(',')[0];
//     item.width = item.list.every(item1 => item1.state == 0) ? 24 : 49;
//     item.height = item.list.every(item1 => item1.state == 0) ? 35 : 71;
//     item.label = item.list.every(item1 => item1.state == 0) ? "" : {
//       content: item.distance + 'km',
//       textAlign: 'center',
//       anchorX: (item.distance + '').length == 4 ? -15 : (item.distance + '').length == 3 ? -12 : (item.distance + '').length == 1 ? '-9' : '-17',
//       anchorY: -39,
//       fontSize: 9,
//       zIndex: -1,
//       color: "#fff"
//     }
//     item.iconPath = '/images/wash_act.png';
//     return item
//   })
//   return newArr
// }

Page({
  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.height,
    tabHeight: app.globalData.tabHeight,
    nvabarData: { //导航栏
      backFlag: false,
      title: '车秘未来洗车'
    },
    markers: [],
    listFlag: false,
    nearbyStore: '',
    token:'',
    showDef:true,
    lastpage:0,
    storeList:[],
    focus:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    api.login({ query: { telephone: '15208666791' } }).then(res => {
      let token = res.result.token
      if (token) {
        wx.setStorageSync("token", token)
        api.getNearOrder({ query: { token: token } }).then(order => {
          this.setData({
            token: token,
            pageFlag: true,
            orderinfo: order.result
          })
        })
      } else {
        this.setData({
          pageFlag: true
        })
      }
      this.getNearbyStore()
    })
    // wx.login({
    //   success:res=>{
    //     api.login({query:{code:res.code}}).then(res=>{
    //       let token=res.result.token
    //       if(token){
    //         wx.setStorageSync("token", token)
    //         api.getNearOrder({ query: { token: token } }).then(order=>{
    //           this.setData({
    //             token: token,
    //             pageFlag: true,
    //             orderinfo:order.result
    //           })
    //         })
    //       }else{
    //         this.setData({
    //           pageFlag: true
    //         })
    //       }
    //       this.getNearbyStore()
    //     })
    //   },
    //   fail:err=>{
    //     console.log(err)
    //   }
    // })
    
    this.mapCtx = wx.createMapContext("map", this)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function() {
    let token=this.data.token;
    if(token){
      let data = await api.getNearOrder()
      this.setData({
        pageFlag: true,
        orderinfo: data.result
      })
    }
    // this.getCenterLocation()
  },
  /**
   * 获取地理位置
   */
  getNearbyStore() {
    var that = this;
    myAmapFun.getRegeo({
      success: function(data) {
        //成功回调
        let res = data[0]
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          showDef: true
        }, () => {
          that.getStoreList(res.latitude, res.longitude)
        })
      },
      fail: function(info) {
        //失败回调
        if (info) {
          wx.showToast({
            title: '获取地理位置失败，将默认展示贵阳的洗车店',
            icon: 'none'
          })
          that.setData({
            latitude: 26.577723 ,
            longitude: 106.707092,
            showDef:false
          }, () => {
            that.getStoreList(26.577723, 106.707092)
          })
        }
      }
    })
  },
  //获取中心位置坐标
  getCenterLocation(e) {
    var that = this;
    e = e ? e : ''
    if (e.type == 'end' && e.causedBy == 'drag') {
      this.mapCtx.getCenterLocation({
        success: res => {
          let lat = res.latitude
          let lon = res.longitude
          that.getStoreList(lat, lon)
        },
        fail: err => {
          console.log(err)
        }
      })
    }

  },
  // 获取当前地理位置
  getNowLocation() {
    const that = this
    let lat = this.latitude
    let lon = this.longitude
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userLocation']) {
          wx.openSetting({
            success: res1 => {
              if (res1.authSetting['scope.userLocation']) {
                that.getNearbyStore()
              }
            }
          })
        } else {
          that.getNearbyStore()
        }
      }
    })
  },
  /**
  * 获取洗车店-列表
  */
  getStoreListList(lastpage) {
    let lat=this.data.latitude;
    let lon=this.data.longitude
    let list=this.data.storeList
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
        lastpage:store.result.lastpage
      })
    })
  },
  onPullDownRefresh(){
    
  },
  // onReachBottom(){
  //   let lastpage=this.data.lastpage;
  //   if(lastpage===''){
  //     wx.showToast({
  //       title: '已经没有啦',
  //       icon:'none'
  //     })
  //     return
  //   }else{
  //     this.getStoreListList(lastpage)
  //   }
  // },
  /**
   * 获取洗车店-地图
   */
  getStoreList(lat, lon) {
    api.getNearbyWashStore({
      query: {
        adcode: 520100,
        lon: lon,
        lat: lat,
        distance: 5
      },
      method: 'POST'
    }).then(store => {
      let washStore = filterStore(store.result.stores)
      this.setData({
        markers: washStore,
        latitude: lat,
        longitude: lon,
        nearbyStore: washStore.length > 0 ? washStore[0]:''
      },()=>{
        // this.getStoreListList(0)
      })
    })
  },
  /**
   * 设置最近的洗车店-底部卡片
   */
  handleSetNearbyStore(e) {
    console.log(e)
    let storeList = this.data.markers;
    let id=e.markerId
    let store=storeList.filter(item=>item.id==id)[0]
      this.setData({
        nearbyStore: store
      })
  
  },
  /**
   * 去下单页面
   */
  handleGoWash(){
    let storeinfo=this.data.nearbyStore
    wx.navigateTo({
      url: '/pages/placeorder/placeorder?storeinfo=' + JSON.stringify(storeinfo),
    })
  },
  /**
   * 去详情页面
   */
  handleGoOrderProfile(){
    let orderinfo=this.data.orderinfo
    wx.navigateTo({
      url: '/pages/orderprofile/orderprofile?order_id=' + orderinfo.id,
    })
  },
  /**
   * 去搜索页
   */
  goSearch(){
    let latitude=this.data.latitude;
    let longitude=this.data.longitude
    wx.navigateTo({
      url: '/pages/searchpage/searchpage?latitude='+latitude+'&longitude='+longitude,
    })
  },
  /**
   * 切换列表/地图
   */
  handleToggleStore() {
    let flag = this.data.listFlag;
    
    this.setData({
      listFlag: !flag
    })
  },
  /**
   * 去我的页面
   */
  handleGoMine(){
    wx.navigateTo({
      url: '/pages/mine/mine',
    })
  },
  /**
   * 拨打客服电话
   */
  customeCall() {
    wx.makePhoneCall({
      phoneNumber: '400-888-3126' //
    })
  },
})
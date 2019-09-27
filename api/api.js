//接口列表
import {
  wxRequest,
  wxUploadImg
} from '../utils/wxrequest.js'
import regeneratorRuntime from '../utils/regenerator-runtime/runtime'
//登录
const login = async params => wxRequest(params, '/parkWash/login')
//获取短信验证码
const getVerCode = async params => wxRequest(params, '/parkWash/sendSms')
//获取个人信息
const getUserInfo = async params => wxRequest(params, '/parkWash/getUserInfo')
//验证推荐人
const authPman = async params => wxRequest(params,'/parkWash/checkPromo')
//充值余额
const rechargeMoney = params => {
  return new Promise((resolve, reject) => {
    wxRequest(params, '/parkWash/recharge').then(res => {
      let trade_id = res.result.tradeid;
      wxRequest({
        query: {
          tradeid: trade_id
        }
      }, '/wxpaywash/api').then(res1 => {
        let wxParams = res1.result
        wx.requestPayment({
          timeStamp: wxParams.timestamp,
          nonceStr: wxParams.nonceStr,
          package: wxParams.package,
          signType: wxParams.signType,
          paySign: wxParams.paySign,
          success: s => {
            resolve(s)
          },
          fail: e => {
            resolve(e)
          }
        })
      })
    })
  })

}
//获取充值卡类型
const getRechargeCardType = async params => wxRequest(params, '/parkWash/getRechargeCardType')
//获取充值记录
const getTradeList = params => wxRequest(params, '/parkWash/getTradeList')












//首页-获取附近洗车店（地图）
const getNearbyWashStore = async params => wxRequest(params, '/parkWash/getNearbyStore')
//首页列表-获取洗车店列表
const getWashStoreList = async params => wxRequest(params,'/parkWash/getStoreList')
//下单页-获取洗车套餐
const getWashMenu = async params => wxRequest(params, '/parkWash/getStoreItem')
//下单页
const getCarType = async params => wxRequest(params,'/parkWash/getCarType')
//下单页-获取预约排班
const getPoolList = async params => wxRequest(params, '/parkWash/getPoolList')
//获取车辆列表
const getCarList = async params => wxRequest(params, '/parkWash/getCarport')
//添加车牌
const addCar = async params => wxRequest(params, '/parkWash/addCarport')
//编辑车牌
const eritCar = async params => wxRequest(params, '/parkWash/updateCarport')
//删除车牌
const deleteCar = async params => wxRequest(params, '/parkWash/deleteCarport')
//获取汽车品牌
const getCarBrand = async params => wxRequest(params, '/parkWash/getBrandList')
//获取汽车车系
const getCarSeries = async params => wxRequest(params, '/parkWash/getSeriesList')
//获取车位区域列表
const getParkAreaList = async params => wxRequest(params, '/parkWash/getParkArea')
//下单支付
const payOrder = async params => {
  return new Promise((resolve, reject) => {
    wxRequest(params, '/parkWash/createCard').then(data => {
      if (params.query.payway == 'cbpay') {
        wxRequest({ query: { tradeid: data.result.tradeid } }, '/parkWash/payQuery').then(payok => {
          resolve(payok.result)
        })
      } else {
        wxRequest({
          query: {
            tradeid: data.result.tradeid
          }
        }, '/wxpaywash/api').then(wxparams => {
          wxparams = wxparams.result
          wx.requestPayment({
            timeStamp: wxparams.timestamp,
            nonceStr: wxparams.nonceStr,
            package: wxparams.package,
            signType: wxparams.signType,
            paySign: wxparams.paySign,
            success: suc => {
              wxRequest({ query: { tradeid: data.result.tradeid}},'/parkWash/payQuery').then(payok=>{
                resolve(payok.result)
              })
            },
            fail: err => {
              resolve(err)
            }
          })
        })

      }
    })



  })

}
//获取最近一个订单的状态（首页圆球状态）
const getNearOrder = async params => wxRequest(params,'/parkWash/getLastOrderInfo')
//获取订单详情
const getOrderProfile = async params => wxRequest(params,'/parkWash/getOrderInfo')
//更新车位号信息
const updateParkArea = async params => wxRequest(params,'/parkWash/updatePlace')
//获取洗车记录
const getWashRecord = async params => wxRequest(params, '/parkWash/getOrderList')
//取消订单
const cancelOrder = async params => wxRequest(params,'/parkWash/cancelOrder')
//确认完成订单
const orderConfirm = async params => wxRequest(params,'/parkWash/confirmOrder')
module.exports = {
  getNearbyWashStore,
  getWashMenu,
  login,
  getUserInfo,
  getCarList,
  getVerCode,
  addCar,
  eritCar,
  deleteCar,
  getCarBrand,
  getCarSeries,
  getPoolList,
  rechargeMoney,
  getRechargeCardType,
  getTradeList,
  getWashRecord,
  getParkAreaList,
  payOrder,
  getNearOrder,
  getOrderProfile,
  updateParkArea,
  orderConfirm,
  cancelOrder,
  getWashStoreList,
  getCarType,
  authPman
}
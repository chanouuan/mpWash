import tip from './tip.js'
import config from '../config.js'
let apiUrl = config.apiUrl
import regeneratorRuntime from './regenerator-runtime/runtime'
const wxRequest = (params = {}, url) => {
  let token = wx.getStorageSync('token') || ''
  let data = params.query || {};
  data.token = token;
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl + url,
      method: params.method || 'POST',
      data: data,
      header: {
        'Content-Type': 'application/json'
      },
      success: res => {
        if (res.data.errNo == 0) {
          resolve(res.data)
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          reject(res)
          return
        }
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

const wxUploadImg = params => {
  let token = wx.getStorageSync('token') || '';
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: apiUrl + "/index.php/Api/Space/uploadSpaceImg",
      filePath: params,
      header: {
        "Content-Type": "multipart/form-data" //记得设置
      },
      formData: {
        token: token,
      },
      name: 'image',
      success: res => {
        // if(res.data.code==200){
        let data = JSON.parse(res.data)
        if (data.code == 200) {
          resolve(data.data)
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }

      },
      fail: err => {
        reject(err)
      }
    })
  })
}
module.exports = {
  wxRequest,
  wxUploadImg
}
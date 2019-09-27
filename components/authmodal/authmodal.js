// components/authmodal/authmodal.js
import utils from '../../utils/utils.js'
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'
import api from '../../api/api.js'
const telReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(16[0-9]{1})|(19[0-9]{1}))+\d{8})$/;

const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    count: 60,
    codeLength: 4,
    userinfo: ''
  },
  /**
   * 初始
   */
  attached() {
    let userinfo = wx.getStorageSync('userinfo')
    this.setData({
      authFlag: true,
      authSecondFlag: false,
      authLastFlag: false,
      userinfo: userinfo
    })

  },
  /**
   * 组件的方法列表
   */
  methods: {
    //点击微信授权
    async handleWxAuth(e) {
      wx.showLoading({
        title: '加载中'
      })
      let encryptedData = e.detail.encryptedData;
      let iv = e.detail.iv;
      if (iv) {
        wx.login({
          success: res => {
            if (res) {
              let code = res.code
              api.login({
                query: {
                  code: code,
                  encryptedData: encryptedData,
                  iv: iv
                }
              }).then(res => {
                if (res.errNo == 0) {
                  wx.showToast({
                    title: '授权成功',
                    icon:'none'
                  })
                  this.setData({
                    authFlag: false,
                    authSecondFlag: false,
                    authLastFlag: false
                  })
                  wx.setStorageSync("userinfo", res.result)
                  wx.setStorageSync("token", res.result.token)
                  this.triggerEvent('bindok')
                  this.handleCloseModal()
                }else{
                  wx.showToast({
                    title: res.message,
                  })
                }
              })
            }
          }
        })
      }else{
        wx.hideLoading()
        wx.showToast({
          title: '取消授权',
          icon:'none'
        })
      }
    },
    //点击短信验证
    handleTelAuth() {
      this.setData({
        authFlag: false,
        authSecondFlag: true,
        authLastFlag: false
      })
    },
    //输入手机号
    handleEnterTel(e) {
      let mobile = e.detail.value
      this.setData({
        mobile: mobile
      })
    },
    //获取验证码
    async handleGetCode() {
      let count = this.data.count
      let mobile = this.data.mobile
      if (telReg.test(mobile)) {
        let codeInfo = await api.getVerCode({
          query: {
            telephone: mobile
          }
        })
        if (codeInfo) {
          this.setData({
            authFlag: false,
            authSecondFlag: false,
            authLastFlag: true,
          }, () => {
            wx.showToast({
              title: '验证码已发送',
              icon: 'none'
            })
            this.countDown()
          })
        }

      } else {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
      }

    },
    //返回第一个弹窗
    handleBackFirst() {
      this.setData({
        authFlag: true,
        authSecondFlag: false,
        authLastFlag: false
      })
    },
    //返回第二个弹窗
    handleBackSecond() {
      this.setData({
        authFlag: false,
        authSecondFlag: true,
        authLastFlag: false
      })
    },
    //关闭弹窗
    handleCloseModal(e) {
      let flag=e?true:false
      this.setData({
        authFlag: true,
        authSecondFlag: false,
        authLastFlag: false
      })
      this.triggerEvent('closemodal', {
        flag: flag,
      })
    },

    focusBox() {
      this.setData({
        isFocus: true
      })
    },
    //验证码输入验证
    inputCode(e) {
      let mobile = this.data.mobile
      let vercode = e.detail.value
      this.setData({
        code: vercode
      }, () => {
        if (vercode.length >= 4) {
          wx.login({
            success:code=>{
              if(code){
                api.login({
                  query: {
                    telephone: mobile,
                    msgcode: vercode,
                    code:code.code
                  }
                }).then(res => {
                  if (res.result.token) {
                    wx.showToast({
                      title: '绑定成功',
                      icon: 'none'
                    })
                    wx.setStorageSync("userinfo", res.result)
                    wx.setStorageSync("token", res.result.token)
                    this.triggerEvent('bindok')
                    this.handleCloseModal()
                  }else{
                    wx.showToast({
                      title: '验证码错误，请重新输入',
                      icon: 'none'
                    })
                  }
                })
              }
            }
          })
         


        }
      })

    },
    //重新发送
    async handleRefreshSend() {
      let mobile = this.data.mobile
      let codeInfo = await api.getVerCode({
        query: {
          telephone: mobile
        }
      })
      if (codeInfo) {
        wx.showToast({
          title: '验证码已发送',
          icon: 'none'
        })
        this.countDown()
      }
  },
  //倒计时
  countDown() {
    let countDownNum = this.data.count; //获取倒计时初始值
    this.setData({
      timer: setInterval(() => {
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        this.setData({
          count: countDownNum
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum <= 0) {
          this.setData({
            count: 60,
            countFlag: false
          }, () => {
            clearInterval(this.data.timer);
          })
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 1000),
      countFlag: true
    })
  }
}
})
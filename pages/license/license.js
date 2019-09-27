// pages/license/license.js
const app = getApp()
let fetch = require('../../utils/utils.js')
Page({
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '新增车牌', //导航栏 中间的标题
      indexFlag: true,//是否有背景
    },
    height: app.globalData.height ,
    act: 1,
    // 键盘
    provinceArr: ["贵", "粤", "京", "津", "渝", "沪", "冀", "晋", "辽", "吉", "黑", "苏", "浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "琼", "川", "云", "陕", "甘", "青", "蒙", "桂", "宁", "新", "藏", "使", "领", "港", "澳"],
    strArr: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Q", "W", "E", "R", "T", "Y", "U", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"],
    hiddenPro: true, // 省份键盘
    hiddenStr: false, // 数字字母键盘
    numBox: ["贵", , , , , , , ,]
  },
  /**
   *点击省份
   */
  proTap(e) {
    let province = e.currentTarget.dataset.province;
    let numBox = this.data.numBox;
    let act = this.data.act
    numBox.splice(act, 1, province)
    this.setData({
      numBox: numBox,
      hiddenPro: true,
      hiddenStr: false
    }, () => {
      this.setData({
        act: this.data.act + 1
      })
    })
  },
  /**
   *点击字母数字
   */
  strTap(e) {
    let act = this.data.act

    if (act > 7) {
      return
    }
    let num = e.currentTarget.dataset.str;
    let numBox = this.data.numBox;
    numBox.splice(act, 1, num)
    this.setData({
      numBox: numBox,
    }, () => {
      this.setData({
        act: act >= 7 ? 7 : act + 1
      })
    })

  },
  /**
   *退格
   */
  backSpace() {
    let numBox = this.data.numBox;
    let act = this.data.act;
    numBox.splice(act, 1, null)
    if (act == 1) {
      this.setData({
        hiddenPro: false,
        hiddenStr: true
      })
    }
    this.setData({
      numBox: numBox,
    }, () => {
      this.setData({
        act: act <= 0 ? 0 : act - 1
      })
    })
  },
  /**
   *点击车牌
   */
  changeNum(e) {
    let index = e.target.dataset.index
    if (index == 0) {
      this.setData({
        hiddenPro: false,
        hiddenStr: true
      })
    } else {
      this.setData({
        hiddenPro: true,
        hiddenStr: false
      })
    }
    this.setData({
      act: index
    })

  },
  /**
   * 确定新增按钮
   */
  handleNewCard() {
    let num = this.data.numBox.join("");
    fetch.setStorage('license',num).then(res=>{
      console.log('ss')
      wx.navigateTo({
        url: '/pages/carinfo/carinfo'
      })
    })
   
   
  }
})
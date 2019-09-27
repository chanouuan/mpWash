// components/keyboard/keyboard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    keyboardFlag: {//显示键盘
      type: Boolean
    },
    provinceFlag: {//省份键盘
      type: Boolean
    },
    showNumFlag: {//数字键盘
      type: Boolean
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    provinceArr: ["贵", "粤", "京", "津", "渝", "沪", "冀", "晋", "辽", "吉", "黑", "苏", "浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "琼", "川", "云", "陕", "甘", "青", "蒙", "桂", "宁", "新", "藏", "使", "领", "港", "澳"],
    numArr: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    letterArr: ["Q", "W", "E", "R", "T", "Y", "U", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"],
    selectLicense: ['贵', , , , , , , ,],
    keyboardFlag: false,
    provinceFlag: true,
    showNumFlag: false,
    license_act: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //选择车牌键盘
    handleSelectLicense(e) {
      let value = e.currentTarget.dataset.value;
      let act = this.data.license_act
      if (act >= 8) {
        return
      }
      let arr = this.data.selectLicense;
      arr.splice(act, 1, value);
      if (act == 0) {
        this.triggerEvent('callback', { act: act + 1 })
        this.setData({
          selectLicense: arr,
          provinceFlag: false,
          showNumFlag: false
        })
      } else {
        this.triggerEvent('callback', { act: act + 1 })
        this.setData({
          selectLicense: arr,
          showNumFlag: true
        })
      }

    },
    //回退
    handleDeleteLicense() {
      let index = this.data.license_act;
      let arr = this.data.selectLicense
      arr.splice(index, 1, '')
      if (index <= 0) {
        this.triggerEvent('callback', { act: 0 })
        this.setData({
          keyboardFlag: false,
          selectLicense: [, , , , , , , ,]
        })
        return
      }
      if (index == 1) {
        this.setData({
          provinceFlag: true
        })
      } else if (index == 2) {
        this.setData({
          provinceFlag: false,
          showNumFlag: false
        })
      }
      this.triggerEvent('callback', { act: index - 1 })
      this.setData({
        license_act: index - 1,
        selectLicense: arr
      })

    },
    //关闭键盘
    handleCloseKeyboard(e) {
      this.setData({
        keyboardFlag: false
      })
    }
  }
})
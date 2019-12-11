// miniprogram/pages/launch.js

var QQMapWX = require('../../libs/tencentMap/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 实例化QQMap API核心类
    qqmapsdk = new QQMapWX({
      key: 'EODBZ-QLAKU-J4YVK-B466W-E46RZ-JCFPT'
    });
    //获取用户当前位置
    wx.getLocation({
      success: (res) => {
        this.setData({ userlatitude: res.latitude, userlongitude: res.longitude })
      },
      fail: (res) => {
        this.setData({ warning: '获取位置信息失败！请重新授权' })
      },
      complete: (res) => {
        //DEBUG
        //console.log(this.data)
      }
    })
    if (this.data.warning == '' || this.data.warning == null) {
      //console.log("location located!");
    }

    //获取卡路里 初始化用户信息
    new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'init',
        data: {},
        success: resolve,
        fail: reject
      })
    }).then((res) => {
      return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name: 'data',
          data: {
            query: `{
              info{
                weekCal
                dailyCal
                tswkCal
                todayCal
              }
            }`
          },
          success: resolve,
          fail: reject
        })
      })
    }).then((res) => {
      let app = getApp()
      app.kcalInfo = res.result.data.info
      //console.log(res.result)
      return new Promise((resolve, reject) => {
        qqmapsdk.search({
          keyword: '奶茶',
          success: resolve,
          fail: reject
        })
      })
    }).then((res) => {
      let storeData = res.data
      let app = getApp()
      app.storeList = storeData
      this.setData({ teaList: storeData })
      let shopList = []
      for (let item of this.data.teaList) {
        //console.log(item)
        if (item.title.match("1点点") != null) {
          shopList.push("Alittle");
        }
        else if (item.title.match("50岚") != null) {
          shopList.push("50lan");
        }
        else {
          shopList.push("default");
        }
      }
      this.setData({ shopList })
      if (shopList) {
        //console.log(shopList);
      }
      return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name: 'data',
          data: {
            query: `query {
                menu(shop:`+ JSON.stringify(this.data.shopList) + `){
                  name
                  menu {
                    name
                    size
                    kcal
                  }
                  ingredient {
                    name
                    kcal
                  }
                }
              }`
          },
          success: resolve,
          fail: reject
        })
      })
    }).then((res) => {
      //console.log(res.result.data)
      var app = getApp()
      app.allMenus = res.result.data.menu
      this.direct()
      /*
      let selectedTea = app.filter()
      selectedTea.cup = app.allMenus[selectedTea.shopIndex].menu[selectedTea.teaIndex]
      selectedTea.ingredient = app.allMenus[selectedTea.shopIndex].ingredient[selectedTea.ingredientIndex]
      this.setData({
        selectedTea
      })
      console.log(selectedTea)
      */
    })
  },

  /**
   * 跳转函数--至首页
   * 初始化加载完成之后调用这个，把上面onLoad里面的定时器改掉
   */
  direct() {
    let url = '/pages/index/index'
    wx.switchTab({
      url,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
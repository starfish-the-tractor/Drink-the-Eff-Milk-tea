// pages/map/map.js
var QQMapWX = require('../../libs/tencentMap/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户位置信息
    userlongitude : '',
    userlatitude : '',
    //异常信息
    warning : '',
    //奶茶店列表
    teaList : '',
  },

  /**
   * 自定义函数
   */
  enterStore: function(event){
   
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 实例化QQMap API核心类
    qqmapsdk = new QQMapWX({
      key: 'EODBZ-QLAKU-J4YVK-B466W-E46RZ-JCFPT'
    });
    //获取用户当前位置
    wx.getLocation({
      success: (res) =>  {
        this.setData({ userlatitude: res.latitude, userlongitude: res.longitude })
      },
      fail:(res) =>{
        this.setData({warning : '获取位置信息失败！请重新授权'})
      },
      complete: (res)=>{
        //DEBUG
        //console.log(this.data)
      }
    })
    if(this.data.warning == '' || this.data.warning == null){
      //console.log("location located!");
    }

    qqmapsdk.search({
      keyword: '奶茶',
      success: (res) => {
        //重构搜索信息用于卡片展示和地图标识
        let storeData = []
        for (let item of res.data) {
          let tempData = {};
          tempData.id = item.id
          tempData.longitude = item.location.lng
          tempData.latitude = item.location.lat
          tempData.title = item.title
          tempData.distance = item._distance
          tempData.address = item.address
          storeData.push(tempData)
          //TODO 店铺评价获取
        }
        this.setData({ teaList: storeData })
        //console.log(this.data)
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
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
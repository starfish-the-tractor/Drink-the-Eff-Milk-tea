// pages/index/index.js
var QQMapWX = require('../../libs/tencentMap/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageConvert: {
      "波霸": "../../images/milktea/boba.png",
      "椰果": "../../images/milktea/coconut.png",
      "珍珠": "../../images/milktea/boba.png",
      "冰淇淋": "../../images/milktea/icecream.png",
      "仙草": "../../images/milktea/xiancao.png",
      "奶盖": "../../images/milktea/milkcover.png",
      "阿萨姆红茶": { base: "../../images/milktea/teamilk.png", ingredient: [] },
      "茉莉绿茶": { base: "../../images/milktea/Matcha.png", ingredient: [] },
      "四季春茶": { base: "../../images/milktea/Matcha.png", ingredient: [] },
      "四季奶青": { base: "../../images/milktea/Matcha.png", ingredient: [] },
      "波霸奶茶": { base: "../../images/milktea/teamilk.png", ingredient: ["../../images/milktea/boba.png"] },
      "奶茶": { base: "../../images/milktea/teamilk.png", ingredient: [] },
      "乌龙奶茶": { base: "../../images/milktea/chocolate.png", ingredient: [] },
    },
    //用户位置信息
    userlongitude: '',
    userlatitude: '',
    //异常信息
    warning: '',
    //奶茶店列表
    teaList: [],
    //上传的列表
    shopList: [],
    //随机出的奶茶列表
    selectedTea: {},
    selectedStoreInfo: {}
  },

  drink: function(kcal){
    //TODO 喝奶茶！
    wx.showLoading({
      title: '加载中',
      mask: true
    }),
    wx.cloud.callFunction({
     
      name:'data',
      data:{
        query:`mutation {
          drink(kcal:`+this.data.selectedTea.kcal+`)
        }`
      },
      success: res =>{
        wx.hideLoading()
        wx.showToast({
          title: '喝掉啦！',
          duration: 1000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp()
    let selectedTea = app.filter()
    selectedTea.cup = app.allMenus[selectedTea.shopIndex].menu[selectedTea.teaIndex]
    if(selectedTea.ingredientIndex == -1){
      selectedTea.ingredient={name:'无',kcal:0}
    }
    else{
      selectedTea.ingredient = app.allMenus[selectedTea.shopIndex].ingredient[selectedTea.ingredientIndex]
    }
    selectedTea.kcal = selectedTea.cup.kcal + selectedTea.ingredient.kcal
    this.setData({selectedTea})
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
    var app = getApp()
    if(app.tempCup != null){
      this.setData({
        selectedTea:app.tempCup
      })
      app.tempCup = null
      console.log(this.data.selectedTea)
    }
    var tempStoreInfo = app.storeList[this.data.selectedTea.shopIndex]
    //获取选中店铺的信息
    this.setData({
      selectedStoreInfo: tempStoreInfo
    })
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
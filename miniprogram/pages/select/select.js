// pages/select/select.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageConvert:{
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
    shops:[
      {name:"1点点"},
    ],
    ingredient:[
      { name: "波霸", checked: true },
      { name: "椰果", checked: true },
      { name: "珍珠", checked: true },
      { name: "冰淇淋", checked: true },
      { name: "仙草", checked: true },
      { name: "奶盖", checked: true },
    ],
    selectTea:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp()
    let shops = []
    for(let it of app.storeList){
      shops.push({name:it.title,checked:true})
    }
    this.setData({shops})
    //console.log(shops)
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
    this.buildSelect()
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

  },

  buildSelect(){
    let app=getApp()
    let selectTea = []
    let fav={shop:[],ingredient:{}}
    for(let it of this.data.shops){
      fav.shop.push(!!it.checked)
    }
    for(let it of this.data.ingredient){
      fav.ingredient[it.name]=!!it.checked
    }
    for (let i = 0; i < 5; i++) {
      let filter = app.filter(fav)
      filter.index=i
      filter.cup = app.allMenus[filter.shopIndex].menu[filter.teaIndex]
      if (filter.ingredientIndex == -1) {
        filter.ingredient = { name: '无', kcal: 0 }
      } else {
        filter.ingredient = app.allMenus[filter.shopIndex].ingredient[filter.ingredientIndex]
      }
      filter.kcal = (filter.cup.kcal + filter.ingredient.kcal).toFixed(2)
      selectTea.push(filter)
    }
    this.setData({ selectTea })
  },

  btnShopClick: function (e) {
    let shops=this.data.shops
    let close=false
    for(let it of shops){
      if(it.name==e.target.id){
        close|=!it.checked
      }else{
        close|=!!it.checked
      }
    }
    if(!close){
      wx.showToast({
        title: '请至少保持一家店',
      })
      return
    }
    for(let it of shops){
      if(it.name==e.target.id){
        it.checked=!it.checked
        break
      }
    }
    this.setData({shops})
    this.buildSelect()
  },

  btnIngredientClick: function (e) {
    //console.log(this.data.ingredient)
    let ingredient = this.data.ingredient
    for (let it of ingredient) {
      if (it.name == e.target.id) {
        it.checked = !it.checked
        break
      }
    }
    this.setData({ ingredient })
    this.buildSelect()
  },

  selTea:function(e){
    //console.log(e.target.id)
    let app=getApp()
    app.tempCup=this.data.selectTea[e.target.id]
    wx.navigateBack()
  }
})
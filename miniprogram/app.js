//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}
  },

  filter:function(fav){
    let allowKcal = Math.min(this.kcalInfo.dailyCal, this.kcalInfo.weekCal-this.kcalInfo.tswkCal)
    let selectedShop = null
    let shopIndex = -1
    while (selectedShop == null || (shopIndex!=-1 && fav!=null && !fav.shop[shopIndex])) {
      shopIndex = Math.round(Math.random() * (this.allMenus.length - 1))
      selectedShop = this.allMenus[shopIndex]
    }
    let teaIndex
    do{
      teaIndex = Math.round(Math.random() * (selectedShop.menu.length - 1))
    }
    while(selectedShop.menu[teaIndex].kcal > allowKcal)
    let ingredientIndex = Math.round(Math.random() * (selectedShop.ingredient.length - 1))
    if (selectedShop.menu[teaIndex].kcal + selectedShop.ingredient[ingredientIndex].kcal > allowKcal || fav!=null && !fav.ingredient[selectedShop.ingredient[ingredientIndex].name]){
      ingredientIndex = -1
    }
    return {shopIndex, teaIndex, ingredientIndex}
  }
})

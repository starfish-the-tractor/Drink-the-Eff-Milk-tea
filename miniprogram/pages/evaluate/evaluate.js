// pages/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeInfo: {
      id : 0
    },

    files: [],

    star: 0,
    starMap: [
      '非常差',
      '差',
      '一般',
      '好',
      '非常好',
    ],
    evaluateText: '',
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });

        console.log(that.data.files)
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  //五星评分的动态操作
  myStarChoose(e) {
    let star = parseInt(e.target.dataset.star) || 0;
    this.setData({
      star: star,
    });
  },

  //输入数据绑定
  onInputText: function(event){
    //console.log(event)
    this.setData({ evaluateText: event.detail.value}) 
    //console.log(this.data.evaluateText)
  },

  //上传逻辑
  submit:function(){
    let varify = true
    if(this.data.star == 0){
      varify = false
      wx.showToast({
        title: '请先评价星级',
        image: '../../images/cross.png',
        duration: 1000
      })
    }
    else if(this.data.evaluateText == null || this.data.evaluateText == ''){
      varify = false
      wx.showToast({
        title: '请输入评价',
        image: '../../images/cross.png',
        duration: 1000
      })
    }
    else if(this.data.files.length == 0){
      varify = false
      wx.showToast({
        title: '请上传照片',
        image: '../../images/cross.png',
        duration: 1000
      })
    }
    
    if(varify == true){
      wx.showLoading({
        title: "上传中",
        mask: true,
      })
      //获取用户信息以得到唯一文件名
      wx.getUserInfo({
        success: (res) => {
          wx.cloud.uploadFile({
            cloudPath: 'userImages/' + res.encryptedData.substring(0, 20).replace(/\+/g, '_').replace(/\//g, '-') + new Date().getTime().toString() + this.data.files[0].match(/\.\w+$/).toString(),
            filePath: this.data.files[0],
            success: (res) => {
              //上传用户评价
              wx.cloud.callFunction({
                name: 'uploadToken',
                data: {
                  evaluateText: this.evaluateText,
                  stars: this.star,
                  image: res.fileID
                },
                success: res => {
                  wx.navigateBack({
                    success: res => {
                      wx.showToast({
                        title: '上传成功',
                        duration: 1000,
                      })
                    }
                  })
                },
                fail: res => {
                  wx.showToast({
                    title: '上传失败',
                    image: '../../images/cross.png',
                    duration: 1000
                  })
                },
                complete: res => {
                  wx.hideLoading()
                }
              })
            },
            fail: res => {
              wx.showToast({
                title: '上传失败',
                image: '../../images/cross.png',
                duration: 1000
              })
            }
          })

        },
        fail: res => {
          wx.showToast({
            title: '获取信息失败',
            image: '../../images/cross.png',
            duration: 1000
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.hideLoading()
    let app = getApp()
    this.setData({ storeInfo: app.currentStoreInfo})
    console.log(this.data.storeInfo)
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
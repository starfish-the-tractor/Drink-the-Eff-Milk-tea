// pages/userInfo/userInfo.js
var wxCharts = require('../../libs/wechart/wxcharts.js');
var app = getApp();
var lineChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['1500大卡', '1700大卡', '1900大卡', '2100大卡', '2300大卡', '2500大卡', '2700大卡'],
    float_num: 0.0,
    index: 0
  },
  bindPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    this.data.float_num = parseFloat(this.data.array[this.data.index].substr(0,4));
    wx.cloud.callFunction({
      name:'data',
      data:{
        query:`mutation {
          updateInfo(info:{
            weekCal:`+this.data.float_num+`
          })
        }`
      },
      success:(res)=>{
        //console.log(res.result)
      }
    })
  },

  touchHandler: function (e) {
    //console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  
  createSimulationData: function () {
    var categories = [];
    var data = [];
    for (var i = 0; i < 7; i++) {
      switch (i) {
        case 0:
          categories.push('Sun');
          break;
        case 1:
          categories.push('Mon');
          break;
        case 2:
          categories.push('Tues');
          break;
        case 3:
          categories.push('Wed');
          break;
        case 4:
          categories.push('Thur');
          break;
        case 5:
          categories.push('Fri');
          break;
        case 6:
          categories.push('Sat');
          break;
      }
      data.push(0);
    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },
  
  recreateSimulationData: function (val) {
    var categories = [];
    var data = [];
    data = val;
    for (var i = 0; i < 7; i++) {
      switch (i) {
        case 0:
          categories.push('Sun');
          break;
        case 1:
          categories.push('Mon');
          break;
        case 2:
          categories.push('Tues');
          break;
        case 3:
          categories.push('Wed');
          break;
        case 4:
          categories.push('Thur');
          break;
        case 5:
          categories.push('Fri');
          break;
        case 6:
          categories.push('Sat');
          break;
      }
      //data.push(val[i]);
    }
    return {
      categories: categories,
      data: data
    }
  },
  updateData: function (in_data) {
    var simulationData = this.recreateSimulationData(in_data);
    var series = [{
      name: '摄入量',
      data: simulationData.data,
      format: function (val, name) {
        return val.toFixed(2) + '大卡';
      }
    }];
    lineChart.updateData({
      categories: simulationData.categories,
      series: series,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (options) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '摄入量',
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + '大卡';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        max: 3
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
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
    wx.cloud.callFunction({
      name: 'init',
      data: {},
      success: (res) => {
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
          success: (res) => {
            var data = [];
            //console.log(res.result)
            for (var i = 0; i < 7; i++)
              data.push(res.result.data.info.todayCal[i]);
            this.updateData(data);
            this.data.index = res.result.data.dailyCal;
          }
        })
      }
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
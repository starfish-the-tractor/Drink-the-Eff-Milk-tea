// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let data = await db.collection('userinfo').where({
    _id: wxContext.OPENID
  }).get()
  let newDate = new Date()
  newDate.setUTCHours(0, 0, 0, 0)
  if (data.data.length == 0) {
    data = await db.collection('userinfo').add({
      data: {
        _id: wxContext.OPENID,
        admin: false,
        weekCal: 2000,
        dailyCal: 700,
        tswkCal: 0,
        todayCal: [0, 0, 0, 0, 0, 0, 0],
        date: newDate.toJSON()
      }
    })
  } else {
    //日期刷新
    let oldDate = new Date(data.data[0].date)
    if (oldDate.getTime() == newDate.getTime()) {
      return ''
    }
    if ((newDate.getTime() - oldDate.getTime()) / 24 / 3600 / 1000 != newDate.getUTCDay() - oldDate.getUTCDay()) {
      //renew today because new week
      await db.collection('userinfo').where({
        _id: wxContext.OPENID
      }).update({
        data: {
          date: newDate.toJSON(),
          todayCal: [0, 0, 0, 0, 0, 0, 0]
        }
      })
    } else {
      await db.collection('userinfo').where({
        _id: wxContext.OPENID
      }).update({
        data: {
          date: newDate.toJSON()
        }
      })
    }
  }
  return data//null is ok
}
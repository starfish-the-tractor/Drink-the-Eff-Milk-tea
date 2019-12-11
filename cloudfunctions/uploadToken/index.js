// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  await db.collection('uploadToken').add({
    data: {
      openid: wxContext.OPENID,
      evaluateText: event.evaluateText || '',
      stars: event.stars || 3,
      image: event.image || ''
    }
  })
  return
  /*return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }*/
}
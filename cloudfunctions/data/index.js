// 云函数入口文件
const cloud = require('wx-server-sdk')
const {
  graphql,
  buildSchema,
  GraphQLObjectType,
  GraphQLString
} = require('graphql')

cloud.init()

const db = cloud.database()

const schema = buildSchema(`
  type Query {
    info: Info
    menu(shop: [String]!): [Menu]
  }
  type Info {
    weekCal: Float
    dailyCal: Float
    tswkCal: Float
    todayCal: [Float]
  }
  type Menu {
    name: String
    menu: [MenuItem]
    ingredient: [Ingredient]
  }
  type MenuItem {
    name: String
    size: String
    kcal: Float
  }
  type Ingredient {
    name: String
    kcal: Float
  }
  input InputInfo {
    weekCal: Float
    dailyCal: Float
    tswkCal: Float
  }
  type Mutation {
    updateInfo(info: InputInfo!): String
    drink(kcal: Float!): String
  }
`)

const solver = {
  info: (args) => {
    return db.collection('userinfo').where({
      _id: cloud.getWXContext().OPENID
    }).get().then((res) => {
      return res.data[0]
    })
  },
  menu: (args) => {
    let arr = []
    for (let id of args.shop) {
      arr.push(db.collection('menu').where({
        _id: id
      }).get())
    }
    return Promise.all(arr).then((res) => {
      let result = []
      for (let it of res) {
        result.push(it.data[0])
      }
      return result
    })
  },
  updateInfo: (args) => {
    //return JSON.stringify(args)
    return db.collection('userinfo').where({
      _id: cloud.getWXContext().OPENID
    }).update({
      data: JSON.parse(JSON.stringify(args.info))
    }).then((res) => {
      return 'ok'//JSON.stringify(args)
    })
  },
  drink: (args) => {
    let newDate = new Date()
    newDate.setUTCHours(0, 0, 0, 0)
    let day = newDate.getUTCDay()
    return db.collection('userinfo').where({
      _id: cloud.getWXContext().OPENID
    }).get().then((res) => {
      let todayCal = res.data[0].todayCal
      todayCal[day] += args.kcal
      let tswkCal = res.data[0].todayCal + args.kcal
      return db.collection('userinfo').where({
        _id: cloud.getWXContext().OPENID
      }).update({
        data: {
          tswkCal,
          todayCal
        }
      }).then((res)=>{
        return
      })
    })
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  return await graphql(schema, event.query, solver)
  /*const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }*/
}
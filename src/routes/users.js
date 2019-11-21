/*
 * @Description: 用户相关的 路由
 * @Author: Wong
 * @Date: 2019-10-28 13:55:06
 */

const router = require('koa-router')()

const {
    register,
    login,
    getUserInfoById,
    updateUserInfo,
    getUserList
} = require('../controller/users.js')

const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')

const {
    SECRET_KEY
} = require('../utils/cryp')

const jwt = require('jsonwebtoken')

router.prefix('/api/user')

router.post('/register', async function (ctx, next) {
    const userInfo = ctx.request.body
    const { username, password, email } = userInfo
   
    
    if (!userInfo.username) {
        return new ErrorModel('用户名不能为空！')
    }

    if (!userInfo.email) {
        return new ErrorModel('邮箱不能为空！')
    }

    if (!userInfo.password) {
        return new ErrorModel('密码不能为空！')
    }



    const data = await register(username, password, email)

    if (data) {
        return ctx.body = new SuccessModel('注册成功!')
    }

    return new ErrorModel('注册失败')
})


router.post('/login', async function (ctx, next) {
    const {
        userName,
        password
    } = ctx.request.body

    const data = await login(userName, password)

    const userToken = {
        username: data.userName,
        userId: data.userId
    }

    if (data.userName) {
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1小时过期
            data: userToken
        }, SECRET_KEY)

        ctx.body = new SuccessModel({
            userInfo: data,
            token: token
        }, '登录成功')
        return
    }

    ctx.body = new ErrorModel('用户名或密码错误!')
})

router.get('/getUserInfoById', async function (ctx, next) {
    const userId = ctx.query.userId

    const data = await getUserInfoById(userId)

    if (data) {
        ctx.body = new SuccessModel(data, '获取成功')
    }

    return new ErrorModel()
})

router.post('/updateUserInfo', async function (ctx, next) {
    const userInfo = ctx.request.body
    const data = await updateUserInfo(userInfo)

    if (data) {
        return ctx.body = new SuccessModel('更新成功!')
    }

    return new ErrorModel('用户名或密码错误!')
})

router.post('/updateUserAvatar', async function(ctx, next ) {
    
})

router.get('/userList', async (ctx, next) => {
    const userListData = await getUserList()
    ctx.body = new SuccessModel(userListData, '成功')
})

module.exports = router
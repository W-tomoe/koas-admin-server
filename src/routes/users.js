const router = require('koa-router')()

const {
    register,
    login,
    updateUserInfo
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

router.get('/getUserDetail', async function (ctx, next) {
    const userid = ctx.query.userid

    const data = await getUserDetail(userid)

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

router.get('/test', async (ctx, next) => {
    let token = ctx.request.header.authorization;
    if (token) {
        //  获取到token
        let toke = token.split(' ')[1]
        // 解析
        let decoded = jwt.decode(toke, SECRET_KEY)

        if (decoded && decoded.exp <= new Date() / 1000) {
            ctx.body = {
                message: 'token过期',
                code: 3
            }
        } else {
            ctx.body = {
                message: '解析成功',
                code: 1
            }
        }
    } else {
        // 没有token
        ctx.body = {
            msg: '没有token',
            code: 0
        }
    }
});

module.exports = router
const { LoginErrorModel } = require('../model/resModel')

const errorHandle = async (ctx, next) => {
    return next().catch((err) => {
        if(err.status === 401) {
            ctx.status = 401
            return ctx.body =new LoginErrorModel('未登录')
        }else{
            throw err
        }
    })
}

module.exports = errorHandle;
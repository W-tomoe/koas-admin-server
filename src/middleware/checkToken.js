const jwt = require("jsonwebtoken")
const Promise = require("bluebird");
const verify = Promise.promisify(jwt.verify);

const {
    SECRET_KEY
} = require('../utils/cryp')

async function checkToken(ctx, next) {
    let url = ctx.request.url;
    // 登录注册 不用检查
    if (url == "/api/user/login" || url == "/api/user/register" ) {
        await next()
    } else {
        // 规定token写在header 的 'autohrization' 
        let token = ctx.request.headers["authorization"]
        if(token) {
            // 解码
            try {
                await verify(token.split(" ")[1], SECRET_KEY)
                await next()
            } catch (err) {
                console.log(err,'err')
                //过期
                ctx.body = {
                    data: null,
                    status: -1,
                    message: '登录已过期'
                }
            }
        }else {
            ctx.body = {
                data: null,
                status: -1,
                message: '登录失败'
            }
        }
    }
}

module.exports = checkToken
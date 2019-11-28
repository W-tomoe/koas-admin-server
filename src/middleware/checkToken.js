/*
 * @Description: token拦截中间件
 * @Author: Wong
 * @Date: 2019-10-29 11:53:16
 * @LastEditTime: 2019-11-28 14:54:13
 */


const jwt = require("jsonwebtoken")
const Promise = require("bluebird");
const verify = Promise.promisify(jwt.verify);

const {
    SECRET_KEY
} = require('../utils/cryp')

async function checkToken(ctx, next) {
    let url = ctx.request.url;

    // 登录注册 不用检查
    if (url == "/api/user/login" || url == "/api/user/register"  || /\/upload[a-zA-Z0-9]*/.test(url) || /\/thumb/.test(url) ||  /\/updateAvatar/.test(url)) {
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
                console.log(err,'token err')
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
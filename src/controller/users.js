/*
 * @Description: 用户相关 controller
 * @Author: Wong
 * @Date: 2019-10-28 14:00:25
 * @LastEditTime: 2019-11-21 16:29:33
 */

const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')
const { formatDateTime } = require('../utils/formatDateTime')
const xss = require('xss')

const register = async (username, email, password) => {
    username = escape(username)
    email = escape(email)
    // 生成加密密码
    password = genPassword(password)
    password = escape(password)

    const createTime = formatDateTime(new Date(), 'yyyy-MM-dd HH:mm:ss')

    const sql = `insert into  users(userName, password, email, createTime) values(${username}, ${password}, ${email},'${createTime}')`

    const rows = await exec(sql)

    if (rows.affectedRows > 0) {
        return true
    }

    return false
}



const login = async (username, password) => {
    
    username = escape(username)
    // 生成加密密码
    password = genPassword(password)

    password = escape(password)
    
    const sql = `select userName, userId, email, avatar from users where userName=${username} or email=${username} and password=${password}`
    const rows = await exec(sql)
    return rows[0] || {}
}


const getUserInfoById = async (userId) => {
    const sql = `
        select userId, userName, email, avatar, signature,isShield, articleCount, likeCount, commentCount, viewCount, createTime  from users where userId=${userId}
    `
    const rows = await exec(sql)
    return rows[0] || {}
}


const updateUserInfo = async (userInfo) => {
    const userName = xss(userInfo.userName)
    const email = xss(userInfo.email)

    const userId = userInfo.userId

    const sql = `
        update users set userName='${userName}', email='${email}' where userId=${userId}
    `
    
    const updateData = await exec(sql)

    if (updateData.affectedRows > 0) {
        return true
    }

    return false
}

const getUserList = async () => {
    const sql = `select userId, userName, avatar, signature, likeCount,email, commentCount, articleCount, viewCount, isShield from users`
    const rows = await exec(sql)
    return rows || {}
}

// 修改密码
const changePassword = async (userId, oldPassword,newPassword) => {
    oldPassword = escape(oldPassword)
    newPassword = escape(newPassword)
    const sql = `select password from users where userId=${userId}`
}


// 重置密码（忘记密码）
const resetPassword  = async () => {

}

module.exports = {
    register,
    login,
    getUserInfoById,
    updateUserInfo,
    getUserList
}
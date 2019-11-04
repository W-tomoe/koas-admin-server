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
    
    const sql = `
        select userName, userId, email, avatar from users where userName=${username} or email=${username} and password=${password}
    `
    const rows = await exec(sql)
    return rows[0] || {}
}


const getUserDetail = async (userid) => {
    const sql = `
        select userId, userName, email, avatar, articleCount, likeCount, createTime  from users where userId=${userid}
    `
    const rows = await exec(sql)
    return rows[0] || {}
}


const updateUserInfo = async (userInfo) => {
    const username = xss(userInfo.username)
    const email = xss(userInfo.email)

    const userid = userInfo.userid

    const sql = `
        update users set userName='${username}', email='${email}' where userId=${userid}
    `

    const updateData = await exec(sql)

    if (updateData.affectedRows > 0) {
        return true
    }

    return false
}

module.exports = {
    register,
    login,
    getUserDetail,
    updateUserInfo
}
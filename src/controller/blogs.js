/*
 * @Description: 文章相关的 controller
 * @Author: Wong
 * @Date: 2019-10-30 17:11:19
 */
const { exec, escape } = require('../db/mysql')
const { format } = require('silly-datetime')
const newBlog = async(title, domText, plainText, showImg, thumbImg, userId) => {
    title =  escape(title)
    domText =  escape(domText)
    plainText = escape(plainText)

    

    const userSql = `SELECT userName,avatar,email FROM users WHERE userId=${userId}`
    const userDate = await exec(userSql)
    const { userName, avatar, email } = userDate[0]
    
    const sql = `INSERT INTO blogs(title, showImg, thumbImg, plainText, domText, userId, userName, avatar)
    VALUES(${title}, '${showImg}', '${thumbImg}', ${plainText}, ${domText}, ${userId}, '${userName}', '${avatar}')`

    const rows = await exec(sql)

    
    if (rows.affectedRows > 0) {
        const updateACSql = `update users set articleCount=articleCount+'1' where userId=${userId}`
        exec(updateACSql)
        return true
    }
    return false
}

const getBlogsList = async (userId, author, keyword, blogType, beginDateStr, endDateStr, limit, page) => {

    let sql = `SELECT * FROM blogs  where 1=1 `
    const totalSql = 'SELECT count(*) as total FROM blogs where 1=1'

    if(userId) {
        sql+=  `AND userId='${userId}' `
    }

    if(author) {
        sql += `AND userName='${author}' `
    }

    if(keyword) {
        sql+=  `AND keyword='%${keyword}%' `
    }

    if(blogType) {
        sql+=  `AND blogType='${blogType}' `
    }

    
    if(beginDateStr &&  endDateStr) {
        if(beginDateStr === endDateStr) {
            beginDateStr = beginDateStr + ' 00:00:00'
            endDateStr = endDateStr + ' 23:59:59'
        }
        
        sql+=  `AND createTime between '${beginDateStr}' AND '${endDateStr}' `
    }

    sql += ` ORDER BY createTime DESC `

    sql+= `limit ${(page-1)*limit},${(page-1)*limit + limit}`
    const total = await exec(totalSql)
    const blogsData = await exec(sql)

    // 转换返回时间的格式
    blogsData.forEach(item => {
        item.createTime = format(new Date(item.createTime), 'YYYY-MM-DD HH:mm:ss')
    })


    return Promise.resolve({
        data: blogsData,
        pages: {
            page: page,
            limit: limit,
            total: total[0].total
        }
    })
}


const getBlogDetailById = async (id) => {
    
    const sql = `
        select * from blogs where blogId=${id}
    `
    const rows =await exec(sql)

    // 转换返回时间的格式
    rows[0].createTime = format(new Date(rows[0].createTime), 'YYYY-MM-DD HH:mm:ss')

    return rows[0]
}

const updateBlog = async (...updateInfo) => {
    let [  blogId, title, domText, plainText, blogType, showImg, thumbImg ] = updateInfo
    title = escape(title)
    domText = escape(domText)
    plainText = escape(plainText)

    let sql = `
        update blogs set title=${title}, domText=${domText}, plainText=${plainText}, showImg='${showImg}', thumbImg='${thumbImg}'  where blogId=${blogId}
    `

    const rows = await exec(sql)

    if (rows.affectedRows > 0) {
        return true
    }
    return false
}


const deleteBlog = async (userId,blogId) => {
    
    const sql = `delete from blogs where blogId=${blogId}`


    const delData = await exec(sql)
    if(delData.affectedRows > 0) {
        const updateACSql = `update users set articleCount=articleCount-'1' where userId=${userId}`
        exec(updateACSql)

        return true
    }
    return false
}


module.exports = {
    getBlogsList,
    newBlog,
    getBlogDetailById,
    updateBlog,
    deleteBlog
}
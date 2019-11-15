const { exec, escape, unescape } = require('../db/mysql')


const newBlog = async(title,content,showImg,userId) => {
    
    title =  escape(title)
    content =  escape(content)
    const userSql = `SELECT userName,avatar,email FROM users WHERE userId=${userId}`
    const userDate = await exec(userSql)
    const { userName, avatar, email } = userDate[0]

    

    const sql = `INSERT INTO blogs(title, showImg, content, userId, userName, avatar)
    VALUES(${title}, '${showImg}', ${content}, ${userId}, '${userName}', '${avatar}')`


    const rows = await exec(sql)
    
    if (rows.affectedRows > 0) {
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

    
    sql+= `limit ${(page-1)*limit},${(page-1)*limit + limit}`
    console.log(sql,'sql')
    
    const total = await exec(totalSql)
    const blogsData = await exec(sql)

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
    
    return rows[0]
}

const updateBlog = async (...updateInfo) => {
    let [ blogId, title, content, blogType, showImg ] = updateInfo
    title = escape(title)
    content = escape(content)

    let sql = `
        update blogs set title=${title}, content=${content}, blogType=${blogType}
    `
    if(showImg) {
        sql += `showImg='${showImg}' `
    }

    sql += `where blogId=${blogId}`

    const rows = await exec(sql)

    if (rows.affectedRows > 0) {
        return true
    }
    return false
}


const deleteBlog = async (id) => {
    
    const sql = `delete from blogs where blogId=${id}`


    const delData = await exec(sql)
    if(delData.affectedRows > 0) {
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
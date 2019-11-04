const { exec, escape } = require('../db/mysql')


const newBlog = async(title,content,blogType,showImg,userId) => {
    
    title =  escape(title)
    content =  escape(content)
    
    const userSql = `select userName,avatar,email from users where userId=${userId}`
    const userDate = await exec(userSql)
    const { userName, avatar, email } = userDate[0]

    const sql = `insert into blogs(title, content, showImg, blogType, userId, userName, avatar)
    values(${title}, ${content}, '${showImg}', ${blogType}, ${userId}, '${userName}', '${avatar || ""}')`

    const rows = await exec(sql)
    
    if (rows.affectedRows > 0) {
        return true
    }

    return false
}

const getBlogsList = async ({...serchParams}) => {
    const sql = `select * from blogs where 1=1`

    const { author = '', keyword = '', blogType = '', beginDateStr = '', endDateStr = '',userId = '' } = serchParams

    if(author) {
        sql += `and author='${author}'`
    }

    if(keyword) {
        sql+=  `and keyword='%${keyword}%'`
    }

    if(blogType) {
        sql+=  `and blogType='${blogType}'`
    }

    if(beginDateStr) {
        sql+=  `and beginDateStr='${beginDateStr}'`
    }

    if(endDateStr) {
        sql+=  `and beginDateStr='${endDateStr}'`
    }

    return await exec(sql)
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
    console.log(delData,delData.affectedRows,'delData')
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
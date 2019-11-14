const router = require('koa-router')()
const {
    newBlog,
    getBlogsList,
    getBlogDetailById,
    updateBlog,
    deleteBlog
} = require('../controller/blogs.js')

const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')

router.prefix('/api/blog')


router.post('/new', async(ctx, next) => {
    const { title = '', content = '', userId = '', showImg = '' } = ctx.request.body
    
    if(!title) {
        return ctx.body = new ErrorModel('文章标题不能为空')
    }

    if(!showImg) {
        return ctx.body = new ErrorModel('请上传封面')
    }

    if(!content) {
        return ctx.body = new ErrorModel('文章内容不能为空')
    }

    if(!userId) {
        return ctx.body = new ErrorModel('作者id不能为空')
    }

    const data = await newBlog(title, content, showImg, userId)
    
    if(data) {
        ctx.body = new SuccessModel('新建成功')
        return
    }

    return ctx.body = new ErrorModel('新建失败')
})

router.get('/list',async (ctx, next) => {
    let userId = ctx.query.userId || ''
    let author = ctx.query.author || ''
    let keyword = ctx.query.keyword || ''
    let blogType = ctx.query.blogType || ''
    let beginDateStr = ctx.query.beginDateStr || ''
    let endDateStr = ctx.query.beginDateStr || ''
    let limit = ctx.query.limit || 10
    let page = ctx.query.page || 1
    
    const listData = await getBlogsList(userId, author, keyword, blogType, beginDateStr, endDateStr, limit, page)
    
    ctx.body = new SuccessModel(listData.data,'成功',{pages:listData.pages})
})


router.get('/detail', async(ctx, next) => {
    const id = ctx.query.blogId
    if(!id) {
        ctx.body = new ErrorModel('缺少blogId参数')
    }

    const blogDetail =await getBlogDetailById(id)

    ctx.body = new SuccessModel(blogDetail,'成功')
})


router.post('/update',async (ctx, next) => {
    const { blogId='', title='', content='', blogType=1, showImg=''} = ctx.request.body
    
    if(!title) {
        return ctx.body = new ErrorModel('标题不能为空!')
    }
    
    if(!content) {
        return ctx.body = new ErrorModel('标题不能为空!')
    }

    if(!blogId) {
        return ctx.body = new ErrorModel('文章id不能为空!')
    }
    
    const data = await updateBlog( blogId, title, content, blogType, showImg)

    if(data) {
        return ctx.body = new SuccessModel('更新成功')
    }

    return ctx.body = new ErrorModel('更新失败')
})


router.post('/delete', async(ctx, next) => {
    const { blogId } = ctx.request.body
    const delData = await deleteBlog(blogId)
    if(delData) {
        return ctx.body = new SuccessModel('删除成功')
    }
    return ctx.body = new ErrorModel('删除失败')
})




module.exports = router


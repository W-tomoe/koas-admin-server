const path = require('path')
const fs = require('fs')
const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const morgan = require('koa-morgan')
const staticFiles = require('koa-static')
const koaBody = require('koa-body')

const session = require('koa-generic-session')
const redisStore = require('koa-redis')

const jwtKoa = require('koa-jwt')
const cors = require('koa2-cors')

const { REDIS_CONF } = require('./conf/db')
const { SECRET_KEY } = require('./utils/cryp')
const checkToken = require('./middleware/checkToken')

const users = require('./routes/users')
const blogs = require('./routes/blogs')
const upload = require('./routes/upload')

// error handler
onerror(app)

// 启用cors
app.use(cors({
    origin:  function (ctx) {
        return '*'
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
    alloweHeaders: ['Conten-Type', 'Authorization', 'Accept']
}))

// token检测
app.use(checkToken)
app.use(jwtKoa({secret:SECRET_KEY}).unless({
    path: [ /\/login/, /\/register/, /\/upload/]
}))



// 文件上传
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024,
        onFileBegin: (name, file) => {
            // console.log(`name: ${name}, file: ${JSON.stringify(file)}`)
        }
    }
}))



app.use(staticFiles(path.join(__dirname , './public/')))

// 中间件
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

app.use(json())

// 日志
const ENV = process.env.NODE_ENV
if(ENV === 'dev' ) {
    app.use(morgan('dev'))
}else {
    // 线上环境 
    const logFileName = path.join(__dirname,'logs', 'access.log')
    const writeStream = fs.createWriteStream(logFileName, {
        flags: 'a'
    })
    app.use(morgan('combined', {
        stream: writeStream
    }));
}


// 路由
app.use(users.routes(), users.allowedMethods())
app.use(blogs.routes(), blogs.allowedMethods())
app.use(upload.routes(), upload.allowedMethods())


// 错误处理函数
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})


module.exports = app

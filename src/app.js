const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const session = require('koa-generic-session')
const redisStore = require('koa-redis')


const jwtKoa = require('koa-jwt')
const cors = require('koa2-cors')


const { REDIS_CONF } = require('./conf/db')
const { SECRET_KEY } = require('./utils/cryp')
const checkToken = require('./middleware/checkToken')
const errorHandle = require('./middleware/errorHandle')

const users = require('./routes/users')
const blogs = require('./routes/blogs')
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


app.use(checkToken)

app.use(jwtKoa({secret:SECRET_KEY}).unless({
    path: [ /^\/api\/user\/login/, /^\/api\/user\/register/ ]
}))

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

app.use(json())
app.use(logger())




// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})


// routes
app.use(users.routes(), users.allowedMethods())
app.use(blogs.routes(), blogs.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app

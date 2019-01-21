// 导入
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// Use the session middleware
app.use(session({ secret: 'keyboard cat',resave:false,saveUninitialized:false ,cookie: { maxAge: 600000 }}))

//设置静态资源根目录
app.use(express.static(path.join(__dirname,"public")))
// 创建

//导入路由对象，路由中间件写在最后
const accountRouter = require(path.join(__dirname,"routers/accountRouter.js"))

app.use('/account',accountRouter)

app.listen('8888')
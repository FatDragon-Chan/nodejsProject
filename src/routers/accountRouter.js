// 导入
const express = require('express');
const path = require('path');

// 创建路由对象
const accountRouter = express.Router();

//导入控制器对象
const accountControllers = require(path.join(__dirname,"../controllers/accountControllers.js"));

// 获取注册页面
accountRouter.get('/register',accountControllers.getRegisterPage)

// 处理注册请求
accountRouter.post('/register',accountControllers.register)

// 获取登陆页面
accountRouter.get('/login',accountControllers.getLoginPage)

// 处理验证码请求
accountRouter.get('/vcode',accountControllers.getVcodeImage)

// 处理登陆请求
accountRouter.post('/login',accountControllers.login)

// 到处路由器对象
module.exports = accountRouter;
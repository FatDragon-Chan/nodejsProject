const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const captchapng = require('captchapng')
// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "bunana";

exports.getRegisterPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/register.html'))
}
exports.register = (req, res) => {
    const result = {
        status: 0,
        message: "注册成功"
    }
    const {
        username
    } = req.body;

    MongoClient.connect(
        url, {
            useNewUrlParser: true
        },
        function (err, client) {
            // 拿到DB
            const db = client.db(dbName);

            // 拿到集合
            const collection = db.collection('accountInfo');

            // 查询一个
            collection.findOne({
                username
            }, (err, doc) => {
                if (doc) {
                    // 存在
                    result.status = 1;
                    result.message = "用户名已经存在";

                    // 关闭数据库
                    client.close();

                    // 返回
                    res.json(result);
                } else {
                    // 不存在 插入一个文档
                    collection.insertOne(req.body, (err, result2) => {
                        if (!result) {
                            // 失败
                            result.status = 2;
                            result.message = "注册失败"
                        }

                        // 关闭数据库
                        client.close();

                        // 返回
                        res.json(result);
                    })
                }
            })
        }
    )

}
exports.getLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/login.html'))
}
exports.getVcodeImage = (req, res) => {
    const vcode = parseInt(Math.random() * 9000 + 1000);
    req.session.vcode = vcode;
    var p = new captchapng(80, 30, vcode);
    p.color(0, 0, 0, 0)
    p.color(80, 80, 80, 255)

    var img = p.getBase64();
    var imgbase64 = new Buffer(img, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64)
}

exports.login = (req, res) => {
    const result = {
        status: 0,
        message: "登陆成功"
    }
    const {
        username,
        password,
        vcode
    } = req.body;
    console.log(username,password,vcode);
    if (vcode != req.session.vcode) {
        result.status = 2;
        result.message = "验证码填写错误";
        // 返回
        res.json(result);
        return;

    }
    
    MongoClient.connect(url, {
        useNewUrlParser: true
    }, (err, client) => {
        // 拿到DB
        const db = client.db(dbName);

        // 拿到集合
        const collection = db.collection('accountInfo');

        // 查询一个
        collection.findOne({username,password}, (err, doc) => {
            if (!doc) {
                // 不存在
                result.status = 1;
                result.message = "登录失败,账号或密码错误"
            }
                // 关闭数据库
                client.close();
                // 返回
                res.json(result);
        })
    })

}
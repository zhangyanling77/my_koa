/**
 * 1.nodejs中使用session
 * 正常session是存在数据库的，这里用一个session对象模拟
 */

const http = require("http");
const uuid = require('uuid/v1'); // 生成随字符串
const querystring = require("querystring");

// 存放 session
const session = {};

// 创建服务
http.createServer((req, res) => {
    if (req.url === "/user") {
        // 取出 cookie 存储的用户 ID
        let userId = querystring.parse(req.headers["cookie"], "; ")["study"];
        // console.log(userId)
        if (userId) {
            if (session[userId].studyCount === 0) res.end("您的学习次数已用完");
            session[userId].studyCount--;
        } else {
            // 生成 userId
            userId = uuid();
            // 将用户信息存入 session
            session[userId] = { studyCount: 30 };
            // 设置 cookie
            req.setHeader("Set-Cookie", [`study=${userId}`]);
        }

        // 响应信息
        res.end(`
            您的用户 ID 为 ${userId}，
            剩余学习次数为：${session[userId].studyCount}
        `);
    } else {
        res.end("Not Found");
    }
}).listen(3001);
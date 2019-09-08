/**
 * 由于浏览器无状态的特性，cookie 技术应运而生，cookie 是一个会话级的存储，大小 4KB 左右，
 * 用于浏览器将服务器设置的信息重新带给服务器进行验证，[不支持跨域]，
 * 在浏览器清空缓存或超过有效期后失效，不能存放敏感信息.
 * session 是专门用于存储最初设置给浏览器 cookie 数据的地方
 */

//  1.在nodejs中原生操作cookie
const http = require("http");

// 创建服务
http.createServer((req, res) => {
    if (req.url === "/read") {
        // 读取 cookie
        console.log(req.headers.cookie);
        res.end(req.headers.cookie);
    } else if (req.url === "/write") {
        // 设置 cookie
        /**
         * domain用来设置cookie允许访问的域
         * path用来设置允许访问cookie的路径
         * httpOnly用来设置是否允许浏览器(即javascript)中修改cookie，
         * 如果通过浏览器修改设置过httpOnly=true的cookie，则会增加一条同名的cookie，原来的cookie不会被修改
         * Expires用来设置过期的时间，绝对时间，值为一个GMT或UTC格式的时间
         * max-age用来设置过期时间，相对时间，值为一个正整数，单位是秒（s）
         */
        res.setHeader("Set-Cookie", [
            "name=panda; domain=panda.com; path=/write; httpOnly=true",
            `age=24; Expires=${new Date(Date.now() + 1000 * 10).toGMTString()}`,
            `address=${encodeURIComponent("成都")}; max-age=10`
        ]);
        res.end("Write ok");
    } else {
        res.end("Not Found");
    }
}).listen(3000);

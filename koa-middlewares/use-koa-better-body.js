/**
 * koa-better-body 可支持文件上传，是koa1.x中的中间件，用generator函数实现的。
 * 因此在koa2中需要koa-convert将koa-better-body转为koa2.x的中间件
 * 安装：npm i koa koa-better-body koa-convert path uuid
 * 功能：将表单上传的文件存入本地制定的文件夹下，并将流对象挂在 ctx.request.fields 上。
 */

const Koa = require("koa");
const betterBody = require("koa-better-body");
const convert = require("koa-convert"); // 将  koa 1.0 中间转化成 koa 2.0 中间件
const path = require("path");
const fs = require("fs");
const uuid = require("uuid/v1"); // 生成随机串

const app = new Koa();

// 将 koa-better-body 中间件从 koa 1.0 转化成 koa 2.0，并使用中间件
app.use(convert(betterBody({
    uploadDir: path.resolve(__dirname, "upload")
})));

app.use(async (ctx, next) => {
    if (ctx.path === "/" && ctx.method === "POST") {
        // 使用中间件后 ctx.request.fields 属性自动加上了 post 请求的文件数据
        console.log(ctx.request.fields);

        // 将文件重命名
        let imgPath = ctx.request.fields.avatar[0].path;
        let newPath = path.resolve(__dirname, uuid());
        fs.rename(imgPath, newPath);
    }
});

app.listen(3000);

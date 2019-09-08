/**
 * 安装依赖：npm install koa koa-static mime
 * koa-static作用：在服务器接到请求时，帮我们处理静态文件，
 * 如果我们直接访问文件名的时候，会查找这个文件并直接响应，如果没有这个文件路径会当作文件夹，
 * 并查找文件夹下的 index.html，如果存在则直接响应，如果不存在则交给其他中间件处理
 */
// koa-static 的用法
const Koa = require("koa");
const static = require("koa-static");
const path = require("path");

const app = new Koa();

app.use(static(path.resolve(__dirname, "static")));

app.use(async (ctx, next) => {
    ctx.body = "hello world";
});

app.listen(3000);

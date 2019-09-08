/**
 * 在 Express 框架中，路由是被内置在了框架内部，而 Koa 中没有内置，是使用 koa-router 中间件来实现的，使用前需要安装
 * npm install koa koa-router
 * koa-router 导出的是一个类，使用时需要创建一个实例，并且调用实例的 routes 方法将该方法返回的 async 函数进行连接，
 * 但是在匹配路由的时候，会根据路由 get 方法中的路径进行匹配，并串行执行内部的回调函数，
 * 当所有回调函数执行完毕之后会执行整个 Koa 串行的 next
 */
const Koa = require("Koa");
const Router = require("koa-router");

const app = new Koa();
const router = new Router(); //创建路由实例

router.get("/panda", (ctx, next) => {
    ctx.body = "panda";
});

router.get("/panda", (ctx, next) => {
    ctx.body = "pandashen";
});

router.get("/shen", (ctx, next) => {
    ctx.body = "shen";
})

// 调用路由中间件
app.use(router.routes());

app.listen(3000);

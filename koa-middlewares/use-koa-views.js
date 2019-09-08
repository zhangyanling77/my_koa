/**
 * koa-views是基于koa的模版工具
 * 在ctx上挂在了render方法，以实现对模版的渲染和响应页面
 */
// koa-views 的用法
const Koa = require("koa");
const KoaViews = require("koa-views");
const path = require("path");

const app = new Koa();

// 使用中间件
app.use(KoaViews(path.resolve(__dirname, "views"), {
    extension: "ejs"
}));

app.use(async (ctx, next) => {
    await ctx.render("index", { name: "panda", age: 20, arr: [1, 2, 3] });
});

app.listen(3000);

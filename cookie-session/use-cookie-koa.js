// 2.koa中操作cookie
/**
 * koa中设置的cookie默认不允许浏览器通过document.cookie获取，但是服务器也可以被欺骗，
 * 比如使用 postman 发送一个带 Cookie 请求头的请求，服务器可以通过设置签名来预防，即添加 signed 选项并将值设置为 true。
 */
const Koa = require("koa");
const Router = require("koa-router");

// 创建服务和路由
const app = new Koa();
const router = new Router();

// 签名需要设置 key
app.keys = ["shen"];

router.get("/read", (ctx, next) => {
    // 获取cookie ctx.cookies.get("cookie的键名")
    let name = ctx.cookies.get(name) || "No name";
    let age = ctx.cookies.get(age) || "No age";
    ctx.body = `${name}-${age}`;
});

router.get("/write", (ctx, next) => {
    // 设置cookie 
    // ctx.cookies.set("cookie的键名", "cookie的键值",一个配置cookie规则的对象（这里的maxAge为毫秒数）)
    ctx.cookies.set("name", "panda", { domain: "panda.com" });
    ctx.cookies.set("age", 28, { maxAge: 10 * 1000, signed: true });
});

// 使用路由
app.use(router.routes());
app.listen(3000);
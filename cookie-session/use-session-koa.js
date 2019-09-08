const Koa = require("koa");
const Router = require("koa-router");
const session = require("koa-session");
const uuid = require("uuid/v1");

// 创建服务和路由
const app = new Koa();
const router = new Router();

// cookie 的签名
app.keys = ["panda"];

let store = {
    storage: {},
    get (key, maxAge) {
        return this.storage[key]
    },
    set (key, sess, maxAge) {
        this.storage[key] = sess
    },
    destroy (key) {
        delete this.storage[key]
    }
}

// 使用 koa-session 中间件
const CONFIG = {
    key: 'shen',
    maxAge: 10 * 1000,
    httpOnly: true,
    signed: true,
    store
}
app.use(session(CONFIG, app));

router.get("/user", (ctx, next) => {
    // 取出 cookie 存储的用户 ID
    let userId = ctx.cookies.get("study");
    console.log(ctx.session[userId])
    if (ctx.session[userId]) {
        if (ctx.session[userId].studyCount === 0) {
            ctx.body = "您的学习次数已用完";
        }else{
            ctx.session[userId].studyCount--;
            ctx.body = `
                您的用户 ID 为 ${userId}，
                剩余学习次数为：${ctx.session[userId].studyCount}
            `;
        }
        
    } else {
        // 生成 userId
        userId = uuid();
        // 将用户信息存入 session
        ctx.session[userId] = { studyCount: 3 };
        // 设置 cookie
        ctx.cookies.set("study", userId);
        ctx.body = `
            您的用户 ID 为 ${userId}
        `
    }
});

// 使用路由
app.use(router.routes());
// app.use(router.allowedMethods());

app.listen(3002);
console.log('listening on port 3002');
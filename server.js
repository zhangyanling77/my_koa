let Koa = require('./koa/application')
let app = new Koa()

app.use((ctx) => {
    console.log('ctx.req.url>>>>', ctx.req.url)
    console.log('ctx.request.req.url>>>>', ctx.request.req.url)
    console.log('ctx.response.req.url>>>>', ctx.response.req.url)
    console.log('ctx.request.url>>>>', ctx.request.url)
    console.log('ctx.request.path>>>>', ctx.request.path)
    console.log('ctx.url>>>>', ctx.url)
    console.log('ctx.path>>>>', ctx.path)
    // ctx.res.end('hello world')
    ctx.body = 'hello world'
    console.log(ctx.body)
})

app.listen(3000)

console.log("server is on http://localhost:3000")
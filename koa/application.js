/**
 * 入口文件
 * 
 * 创建一个koa类，其实例主要有use和listen两个方法
 * 1.实现listen创建一个http协议并监听一个端口.listen为http的语法糖，因此需要引入http模块
 * 2.use把回调传入
 */

 let http = require('http')
 let EventEmitter = require('events')
 let context = require('./context')
 let request = require('./request')
 let response = require('./response')
 let Stream = require('stream')

 class Koa extends EventEmitter {
     constructor () {
         super()
         this.middlewares = [] // 用一个数组将每个中间件按顺序存放
         this.fn
         this.context = context
         this.request = request
         this.response = response
     }
     /**
      * 用户使用use时，回调赋给this.fn
      * @param {*} fn 
      */
     use (fn) {
        // this.fn = fn 
        this.middlewares.push(fn)
     }
     /**
      * 接收中间件，ctx作为对象
      * @param {*} middlewares 
      * @param {*} ctx 
      */
     compose (middlewares, ctx) {
         // 利用递归函数，将各个中间件串联起来依次调用
        function dispatch(index) {
            // 最后一次next不能执行
            if(index === middlewares.length) return Promise.resolve()
            // 获取当前应该被调用的函数
            let middleware = middlewares[index]
            // 调用并传入ctx和下一个将被调用的函数，用户next()时执行该函数
            return Promise.resolve(middleware(ctx, () => dispatch(index + 1))) 
        }
        // 默认执行第一个中间件
        return dispatch(0)
     }
     /** 
      * 创建ctx
      * @param {*} req 
      * @param {*} res 
      */
     createContext (req, res) {
        /**
         * 使用Object.create方法是为了继承this.context但在增加属性时不影响原对象
         * 连续赋值，从左往右 
         * 先将Object.create(this.request)赋给request，
         * 再将Object.create(this.request)赋给ctx.request
        */
        const ctx = Object.create(this.context)
        const request = ctx.request = Object.create(this.request)
        const response = ctx.response = Object.create(this.response)

        ctx.req = request.req = response.req = req
        ctx.res = request.res = response.res = res
        request.ctx = response.ctx = ctx
        request.response = response
        response.request = request

        return ctx
     }
     /**
      * 创建一个处理请求的函数
      * @param {*} req 
      * @param {*} res 
      */
     handleRequest (req, res) {
         // 默认404
         res.statusCode = 404 
         let ctx = this.createContext(req, res)
         // 调用用户给的回调，并将ctx还给用户使用
         //  this.fn(ctx)
         let fn = this.compose(this.middlewares, ctx)
         fn.then(() => {
             // ctx.body用来输出到页面
            if(typeof ctx.body == 'object'){ 
                // 为对象，按json形式输出
                res.setHeader('Content-Type', 'application/json;charset=utf8')
                res.end(JSON.stringify(ctx.body))
            }else if(ctx.body instanceof Stream){ 
                // 为流
                ctx.body.pipe(res)
            }else if(typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)){ 
                // 为字符串或buffer
                res.setHeader('Content-Type', 'text/html;charset=utf8')
                res.end(ctx.body)
            }else{
                res.end('Not found')
            }
         })
         .catch(err => {
             // 监控错误发送error，用于app.on('error', (err) =>{})
             this.emit('error', err)
             res.statusCode = 500
             res.end('Server error')
         })
         
     }
     /**
      * 创建一个http协议，并监听一个端口
      * @param {*} args 
      */
     listen (...args) {
        //放入回调
        let server = http.createServer(this.handleRequest.bind(this))
        //因为listen可能有多个参数，这里直接解构所有参数 
        server.listen(...args) 
     }
 }

 module.exports = Koa
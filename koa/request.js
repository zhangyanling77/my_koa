/**
 * 请求对象相关
 * 可以直接用ctx.request.url上取值，不用通过原生的req
 */
let url = require('url')

let request = {
    get url() {
        return this.req.url
    },
    get path() {
        return url.parse(this.req.url).pathname
    },
    get query() {
        return url.parse(this.req.url).query
    }
}

module.exports = request
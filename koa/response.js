/**
 * 响应对象相关
 */
let response = {
    get body() {
        return this._body_
    },
    set body(value) {
        // 只要设置了body，就应该将状态码设置为200
        this.res.statusCode = 200
        // 在set时先保存下来
        this._body_ = value
    }
}

module.exports = response
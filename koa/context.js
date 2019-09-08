/**
 * 与上下文对象相关
 * 绑定与请求和响应相关的数据和方法
 */
let proto = {}
/**
 * 创建一个defineGetter函数，参数分别是要代理的对象和对象上的属性
 * @param {*} prop 
 * @param {*} name 
 */
function defineGetter (prop, name) {
    // 每个对象都有一个__defineGetter__方法，可以用这个方法实现代理
    proto.__defineGetter__(name, function(){
        // 这里的this是ctx，所以ctx.url得到的就是this.request.url
        return this[prop][name]
    })
}
/**
 * 用于设置
 * @param {*} prop 
 * @param {*} name 
 */
function defineSetter (prop, name) {
    // 用__defineSetter__方法设置值
    proto.__defineSetter__(name, function(val){ 
        this[prop][name] = val
    })
}

defineGetter('request', 'url')
defineGetter('request', 'path')
defineGetter('response', 'body')
defineSetter('response', 'body')

module.exports = proto
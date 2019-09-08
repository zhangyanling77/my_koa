/**
 * 实现一个Promise
 * @param {* 一个执行器（函数）} executor  
 */
function Promise(executor){ 
    let _this = this
    _this.status = 'pending'
    _this.value = undefined
    _this.reason = undefined
    _this.onResolvedCallbacks = [] // 存放成功的回调
    _this.onRejectedCallbacks = [] // 存放失败的回调

    function resolve(value) {
        if(_this.status === 'pending'){
            _this.status = 'resolved'
            _this.value = value
            _this.onResolvedCallbacks.forEach(function(fn){
                fn()
            })
        }
    }

    function reject(reason) {
        if(_this.status === 'pending'){
            _this.status = 'rejected'
            _this.reason = reason
            _this.onRejectedCallbacks.forEach(function(fn){
                fn()
            })
        }
    }

    try {
        executor(resolve, reject) 
    } catch(e) {
        reject(e)
    }
    
}

// 链式调用的原理：返回一个新的promise
Promise.prototype.then = function(onFulfilled, onRejected){
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function(value){
        return value
    }
    onRejected = typeof onRejected === 'function' ? onRejected : function(err){
        throw err
    }
    let _this = this
    let promise2;

    function resolvePromise(promise2, x, resolve, reject) {
        if(promise2 === x){
            return reject(new TypeError('循环引用了'))
        }
    
        let called;
        if(x !== null && (typeof x === 'object' || typeof x === 'function')){
            try{
                let then = x.then
                if(typeof then === 'function') {
                    then.call(x, function(y) {
                        if (called) return
                        called = true
                        resolvePromise(promise2, x, resolve, reject)
                    }, function(err) {
                        if (called) return
                        called = true
                        reject(err)
                    })
                } else {
                    resolve(x)
                }
            } catch(e) {
                if (called) return
                called = true
                reject(e)
            }
        } else {
            resolve(x)
        }
    }

    if(_this.status === 'pending'){
        promise2 = new Promise(function(resolve, reject){
            _this.onResolvedCallbacks.push(function(){
                setTimeout(function(){
                    try{
                        let x = onFulfilled(_this.value)
                        resolvePromise(promise2, x, resolve, reject);
                    } catch(e) {
                        reject(e)
                    }
                })
            })
            _this.onRejectedCallbacks.push(function(){
                setTimeout(function(){
                    try{
                        let x = onRejected(_this.reason)
                        resolvePromise(promise2, x, resolve, reject);
                    } catch(e) {
                        reject(e)
                    }
                })
            })
        })
       
    }
    if(_this.status === 'resolved'){
        promise2 = new Promise(function(resolve, reject){
            setTimeout(function(){
                try{
                    let x = onFulfilled(_this.value)
                    resolvePromise(promise2, x, resolve, reject);
                } catch(e) {
                    reject(e)
                }
            })
            
        })
    }

    if(_this.status === 'rejected'){
        promise2 = new Promise(function(resolve, reject){
            setTimeout(function(){
                try{
                    let x = onRejected(_this.reason)
                    resolvePromise(promise2, x, resolve, reject);
                } catch(e) {
                    reject(e)
                }
            })
        })
    }

    return promise2
}

Promise.prototype.catch = function (callback) {
    return this.then(null, callback)
}
/**
 * 公开一个适配器接口
 */
Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise(function (resolve, reject) {
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd
}
// 解析全部方法，接收一个Promise数组promises,返回新的Promise，遍历数组，都完成再resolve
Promise.all = function (promises) {
    //promises是一个promise的数组
    return new Promise(function (resolve, reject) {
        let arr = []; //arr是最终返回值的结果
        let i = 0; // 表示成功了多少次
        function processData(index, y) {
            arr[index] = y;
            if (++i === promises.length) {
                resolve(arr);
            }
        }
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(function (y) {
                processData(i, y)
            }, reject)
        }
    })
}
// 只要一个promise成功了就算成功， 如果第一个失败了就失败了
Promise.race = function (promises) {
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < promises.length; i++) {
            promises[i].then(resolve,reject)
        }
    })
}
// 生成一个成功的promise
Promise.resolve = function(value){
    return new Promise(function(resolve,reject){
        resolve(value);
    })
}
// 生成一个失败的promise
Promise.reject = function(reason){
    return new Promise(function(resolve,reject){
        reject(reason);
    })
}

module.exports = Promise
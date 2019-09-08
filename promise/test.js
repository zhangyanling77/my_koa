let Promise = require('./myPromise')

let p1 = new Promise(function(resolve, reject){
    resolve('test')
})

let p2 = new Promise(function(resolve, reject){
    reject('error')
})

p1.then(function(data){
    console.log('成功', data)
}, function(err){
    console.log('失败', err)
})

p2.then(function(data){
    console.log('成功', data)
}, function(err){
    console.log('失败', err)
})

// 成功 test
// 失败 error
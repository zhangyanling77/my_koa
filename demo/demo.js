/**
 * 关于Object.create
 */
let o1 = {a: 'hello'}
let o2 = Object.create(o1)
o2.b = 'world'

console.log('o1:', o1.b) // undefined 创建出的对象不会影响原对象
console.log('o2:', o2.a) // hello 创建出的对象会继承原对象的属性

/**
 * 关于对象的getter和setter
 */

var myObject = {
    get a() {
        return this._a_;
    },
    set a(val) {
        this._a_ = val * 2;
    }
}

Object.defineProperty(
    myObject, 
    "b",
    {
        get: function(){ return this.a * 2 },
        enumerable: true
    }
)
myObject.a = 3

console.log(myObject.a, ">>>>>", myObject.b) //6 >>>>> 12

/**
 * 关于洋葱模型
 * next方法会调用下一个use，next下面的代码会在下一个use执行完再执行
 */

app.use(async(crx, next) => {
    console.log(1)
    await next()
    console.log(2)
})
app.use(async(crx, next) => {
    console.log(3)
    await next()
    console.log(4)
})
app.use(async(crx, next) => {
    console.log(5)
    await next()
    console.log(6)
})

//结果
// 1
// 3
// 5
// 6
// 4
// 2

/**
 * 支持异步 async/await， 必须成对使用
 */

app.use(async (ctx, next) => {
    console.log(1)
    await next()
    console.log(2)
})
app.use(async (ctx, next) => {
    console.log(3)
    let p = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('3.5')
            resolve()
        }, 1000)
    })
    await p.then()
    await next()
    console.log(4)
})

//结果
// 1
// 3
// // 一秒后
// 3.5
// 4
// 2

/**
 * node读取文件
 * 1.txt 内容是，2.txt
 * 2.txt 内容是， 3.txt
 * 3.txt 内容是， 完成
 */

 let readFile = require('fs').readFile; //加载node的fs内置模块，使用readFile异步访问文件

 function getFile(url) {
     return new Promise(function(resolve, reject){ // 返回一个Promise对象
         readFile(url, 'utf8', function(err, data){
             resolve(data)
         })
     })
 }

 getFile('1.txt').then(function(data){
     console.log(data) // 2.txt
     return getFile(data)
 })
 .then(function(data){
    console.log(data) // 3.txt
    return getFile(data)
 })
 .then(function(data){
     console.log(data) //完成
 })

 /**
  * 关于原型链
  */
// 这是一个普通函数
function Foo () {}
// 使用new关键字来实例化，实现一次构造函数调用
var f1 = new Foo()

console.log(f1) // {}
console.log(Foo.prototype) // {}
Object.getPrototypeOf(a) === Foo.prototype; // true
f1.__proto__ === Foo.prototype // true


function Foo(name) { 
    this.name = name;
}
Foo.prototype.myName = function() { 
    return this.name;
};
var a = new Foo( "a" );
var b = new Foo( "b" ); 
a.myName(); // "a"
b.myName(); // "b"
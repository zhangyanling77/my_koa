// js event loop

// Node还有一些不同，它提供了另外两个与"任务队列"有关的方法：process.nextTick和setImmediate

/**
 * process.nextTick方法可以在当前"执行栈"的尾部，下一次Event Loop（主线程读取"任务队列"）之前，触发回调函数。
 * 也就是说，它指定的任务总是发生在所有异步任务之前。
 * 
 * setImmediate方法则是在当前"任务队列"的尾部添加事件，也就是说，
 * 它指定的任务总是在下一次Event Loop时执行，这与setTimeout(fn, 0)很像。
 */  

setTimeout(function(){
    console.log(1)
})
process.nextTick(function () {
    console.log(2);
    process.nextTick(function (){
        console.log(3)
    });
});
setTimeout(function () {
    console.log(4);
})
// 结果 2 3 1 4


setImmediate(function () {
    console.log(1);
    setImmediate(function B(){
      console.log(2)
    })
})
setTimeout(function () {
    console.log(3);
}, 0)
  
// 结果 可能是 312，也可能是 132

// 微任务 有特权，可以插队
// 包括 Promise， Object.observe（已废弃），MutationObserver， MessageChannel
// 宏任务 没有特权，不可以插队
// 包括 setTimeout，setInterval， setImmdiate， I/O

console.log("1");
setTimeout(()=>{
    console.log(2)
    Promise.resolve().then(()=>{
        console.log(3);
        process.nextTick(function foo() {
            console.log(4);
        });
    })
})
Promise.resolve().then(()=>{
    console.log(5);    
    setTimeout(()=>{
        console.log(6)
    })
    Promise.resolve().then(()=>{
        console.log(7);
    })
})
process.nextTick(function foo() {
    console.log(8);
    process.nextTick(function foo() {
        console.log(9);
    });
});
console.log("10")

// 结果 1 10 8 9 5 7 2 3 4 6

// mixin 显示混入（实现一个复制的功能）
// function mixin( sourceObj, targetObj ) {
//     for (var key in sourceObj) {
//         // 只会在不存在的情况下复制 
//         if (!(key in targetObj)) {
//             targetObj[key] = sourceObj[key];
//         }
//     }
//     return targetObj; 
// }
// 发动机
// var Vehicle = { 
//     engines: 1,
//     ignition: function() {
//         console.log( "Turning on my engine." );
//     },
//     drive: function() { 
//         this.ignition();
//         console.log( "Steering and moving forward!" );
//     }
// };
// 车
// var Car = mixin( Vehicle, { 
//     wheels: 4,
//     drive: function() {
//          Vehicle.drive.call( this ); //显示多态
//          console.log("Rolling on all " + this.wheels + " wheels!");
//     } 
// });

// Car.drive()

// 寄生继承
//“传统的 JavaScript 类”Vehicle 
// function Vehicle() {
//     this.engines = 1; 
// }
// Vehicle.prototype.ignition = function() { 
//     console.log( "Turning on my engine." );
// };
// Vehicle.prototype.drive = function() {
//     this.ignition();
//     console.log( "Steering and moving forward!" );
// };

// //“寄生类”Car 
// function Car() {
//     // 首先，car 是一个 Vehicle 
//     var car = new Vehicle();
//     // 接着我们对 car 进行定制 
//     car.wheels = 4;
//     // 保存到 Vehicle::drive() 的特殊引用 
//     var vehDrive = car.drive;
//     // 重写 Vehicle::drive() 
//     car.drive = function() {
//         vehDrive.call(this); //绑定到car
//         console.log("Rolling on all " + this.wheels + " wheels!");
//     }
//     return car;
// }

// var myCar = new Car();
// myCar.drive();

// 隐式混入
// var Something = { 
//     cool: function() {
//         this.greeting = "Hello World";
//         this.count = this.count ? this.count + 1 : 1; 
//     }
// };

// Something.cool();
// Something.greeting; // "Hello World"
// Something.count; // 1


// var Another = {
//     cool: function() {
//         // 隐式把 Something 混入 Another
//         Something.cool.call( this ); 
//     }
// };

// Another.cool();
// Another.greeting; // "Hello World" 
// Another.count; // 1 (count 不是共享状态)

// ---------理解{}和new Object()及Object.create()的区别--------------

var test1 = {x:1};
var test2 = new Object(test1);
var test3 = Object.create(test1);
console.log('test3',test3);//{} 
//test3等价于test5
var test4 = function(){}
test4.prototype = test1;
var test5 = new test4();
console.log('test5',test5); //{}
console.log(test5.__proto__ === test3.__proto__);//true
console.log('test2',test2); //{x:1}


var test1 = {};
var test2 = new Object();
var test3 = Object.create(Object.prototype);
var test4 = Object.create(null);//console.log(test4.__proto__)=>undefined 没有继承原型属性和方法
console.log(test1.__proto__ === test2.__proto__);//true
console.log(test1.__proto__ === test3.__proto__);//true
console.log(test2.__proto__ === test3.__proto__);//true
console.log(test1.__proto__ === test4.__proto__);//false
console.log(test2.__proto__ === test4.__proto__);//false
console.log(test3.__proto__ === test4.__proto__);//false


var test = Object.create({x:123,y:345});
console.log(test);//{}
console.log(test.x);//123
console.log(test.__proto__.x);//123
console.log(test.__proto__.x === test.x);//true

var test1 = new Object({x:123,y:345});
console.log(test1);//{x:123,y:345}
console.log(test1.x);//123
console.log(test1.__proto__.x);//undefined
console.log(test1.__proto__.x === test1.x);//false

var test2 = {x:123,y:345};
console.log(test2);//{x:123,y:345};
console.log(test2.x);//123
console.log(test2.__proto__.x);//undefined
console.log(test2.__proto__.x === test2.x);//false
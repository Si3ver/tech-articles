let log = console.log
// # 高阶函数
// 一、函数作为参数传递
// (1)利用map实现数组每个元素扩大两倍
log([1, 2, 3, 4].map(item => item * 2))
// (2)利用filter实现数组去重
log([1, 2, 1, 2, 3, 5, 4, 5, 3, 4, 4, 4, 4].filter((item, idx, arr) =>
    idx === arr.indexOf(item)
))
// (3)利用reduce实现数组累加
log([1, 2, 3, 4, 5].reduce((acc, value) => (
    acc + value
), 10))

// 二、函数作为返回值
// (1) 类型判断函数
let isType = type => obj => {
    return Object.prototype.toString.call(obj) === `[object ${type}]`
}
log(isType('String')('123'))
log(isType('Array')([1, 2, 3]))
log(isType('Number')(5))
// (2)无限累加器
let add = a => {
    let sum = b => {
        a += b
        return sum
    }
    sum.toString = () => a
    return sum
}
log(add(1))
log(add(1)(2))
log(add(1)(2)(3))
log(add(1)(2)(3)(4))


// 数组拍平
let arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10]
// (1)
log(arr.flat(Infinity))
// (2)
log(arr.toString().split(",").map(Number))
// (3)
Array.prototype.myFlat = function (){
    return [].concat(...this.map(item => {
        return Array.isArray(item) ? item.myFlat() : [item]
    }))
}
log(arr.myFlat())

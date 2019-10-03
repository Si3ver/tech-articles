let log = console.log
// 类型判断
function isType(type) {
    return function (obj) {
        return Object.prototype.toString.call(obj) === `[object ${type}]`
    }
}
log(isType('String')('123'))
log(isType('Array')([1, 2, 3]))
log(isType('Number')(5))
// 无限累加器 add
function add(a) {
    function sum(b) {
        a = a + b
        return sum
    }
    sum.toString = function () {
        return a
    }
    return sum
}
log(add(1))
log(add(1)(2))
log(add(1)(2)(3))
log(add(1)(2)(3)(4))

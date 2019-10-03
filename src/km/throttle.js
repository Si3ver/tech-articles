// 实现方式一：使用时间戳来判断距离上一次执行的时间
const throttle1 = ((fn, wait = 50) => {
    let previous = 0
    return function (...args) {
        let now = +new Date()
        if (now - previous > wait) {
            previous = now
            fn.apply(this, args)
        }
    }
})
// 分析，此种实现方式会受到前台系统时间的影响，慎用。
// 实现方式二：每次执行完回调函数后，设置定时器，一段时间后清除定时器ID。此后，每次事件触发时，如果已经存在定时器，则不触发，定时器清除了才会触发。
const throttle2 = ((fn, wait = 50) => {
    let timerId = null
    return function (...args) {
        if (!timerId) {
            fn.apply(this, args)
            timerId = setTimeout(() => {
                timerId = null
            }, wait)
        }
    }
})
// ————test————
let fn = (a, b, c) => {
    console.log(`[${new Date()}]: fn executes! args = ${a}、${b}、${c}`)
}
let throttled1Fn = throttle1(fn, 1500)
let throttled2Fn = throttle2(fn, 1500)
// 模拟event trigger，快速触发 throttlednFn执行。
setInterval(throttled1Fn, 10, 'arg1', 'arg2', 'arg3')
setInterval(throttled2Fn, 10, 'arg4', 'arg5', 'arg6')

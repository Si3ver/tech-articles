const debounce = (fn, wait = 50, immediate) => {
    let timerId = null
    return function (...args) {
        if (timerId) clearTimeout(timerId)  // 除旧
        if (immediate && !timerId) {        // immediate == true -> 首次执行
            fn.apply(this, args)
        }
        timerId = setTimeout(() => {        // 迎新
            fn.apply(this, args)
        }, wait)
    }
}
let fn = (a, b, c) => {
    console.log(`[${new Date()}]: fn executes! args = ${a}、${b}、${c}`)
}
let debouncedFn = debounce(fn, 1500, true)
let t = setInterval(debouncedFn, 10, 'arg1', 'arg2', 'arg3')


// 在chrome控制台晚一点再粘贴执行
clearInterval(t)

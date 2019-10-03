const debounce1 = (fn, wait = 50) => {
    let timerId = null
    return function (...args) {
        if (timerId) clearTimeout(timerId)  // 除旧
        timerId = setTimeout(() => {        // 迎新
            fn.apply(this, args)
        }, wait)
    }
}
let fn = (a, b, c) => {
    console.log(`[${new Date()}]: fn executes! args = ${a}、${b}、${c}`)
}
let debounced1Fn = debounce1(fn, 1500)
let t = setInterval(debounced1Fn, 10, 'arg1', 'arg2', 'arg3')


// 在chrome里面晚一点再粘贴
clearInterval(t)

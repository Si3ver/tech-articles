let debounce = (fn, timeForWait = 1000) => {
  console.log('[function: debounce] been called!')
  let timerId = null
  return function(){
    let args = [].slice.call(arguments)
    if (timerId) {
        clearTimeout(timerId)
        timerId = null
    }
    timerId = setTimeout(() => {
      fn(...args)
    }, timeForWait)
  }
}

let throttle = (fn, timeForWait = 1000) => {
  console.log('[function: throttle] been called!')
  let timerId = null
  return function(){
    let args = [].slice.call(arguments)
    if(!timerId){
      fn.apply(this,  args);
      timerId = setTimeout(() => {
        timerId = null;
      }, timeForWait)
    }
  }
}

let func = (input) => {
  console.log(`[output] ${input}`)
}
let debouncedFunc = debounce(func, 500)
let throttledFunc = throttle(func, 500)


function onBtn1Click(input) {
  func(input)
}

function onBtn2Click(input) {
  debouncedFunc(input)
}
function onBtn3Click(input) {
  throttledFunc(input)
}

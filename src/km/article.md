# 简洁易懂的防抖与节流科普与JavaScript实现

![](assets/debounceVSthrottle.png)

## 一、防抖

### 1.防抖的概念

函数防抖(debounce)是指，回调函数在一段时间内，无论触发了多少次，都只会执行最后一次。例如，我们设置了3秒等待时间，在这3秒内如果函数被再次触发，就重新计算这3秒，直到新的3秒内该函数没有再次触发，才开始执行函数。

防抖可以理解为要公司的电梯门，每次有新的乘客进入电梯都会刷新等待时间，最后一名乘客进入3秒后电梯门关闭。

+ 「乘客进入电梯」是频繁触发的用户事件
+ 「3秒」是用户事件触发和回调函数执行之间的等待时间
+ 「电梯关门」是事件触发后要执行的回调函数

函数防抖的本质是延迟执行，可能会导致事件触发过于频繁，导致事件一直推迟执行。适合的场景包括，resize事件触发页面重绘，Google搜索输入框的拆你想搜，[跟踪鼠标运动的小鸟](https://code.h5jun.com/wik/3/edit?js,output)等等，加入防抖后，避免频繁更新DOM或频繁触发不必要的后端请求，提高了页面性能。

### 2.防抖的实现

`debounce`函数的实现需要利用高阶函数，传入回调函数`fn`和等待时间间隔`wait`,返回具有「防抖效果」的新回调函数。

防抖有两个过程，即「辞旧」和「迎新」。「辞旧」即清除旧定时器，「迎新」即刷新定时器，添加新的延迟执行函数。

```javascript
const debounce = (fn, wait = 50) => {
    let timerId = null
    return function (...args) {
        if (timerId) clearTimeout(timerId)  // 除旧
        timerId = setTimeout(() => {        // 迎新
            fn.apply(this, args)
        }, wait)
    }
}
```

实际情形中，用户事件可能一直频繁触发，且每次触发间隔都小于定时器时间，导致回调函数永远无法得到执行。通常会传入一个`immediate`的布尔变量，当`immediate`为`true`时，用户事件第一次触发时，回调函数会执行。其实现如下：

```javascript
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
```

### 3.测试一下

```javascript
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
// 模拟频繁触发的用户事件
let t = setInterval(debouncedFn, 10, 'arg1', 'arg2', 'arg3')

// 在chrome控制台晚一点再粘贴执行
clearInterval(t)
```

**测试效果**

![测试效果](./assets/_debounceDemo.gif)

可以看到，设置`immediate`可以使用户事件第一次触发时，回调函数立即执行。之后由于每隔10ms就会触发一次用户事件，导致回调函数一直无法执行。清除定时器后，1500ms后，回调函数得到执行。

## 二、节流

### 1.节流的概念

函数节流(throttle)是指，回调函数在一段时间内最多只会执行一次。在这段等待时间内，会无视新产生的函数执行请求，这段时间结束后，才会重新开始接受该回调函数的新执行请求。

节流可以理解为，关小的水阀，水龙头每隔3秒滴下一滴水，

+ 「管道中的水」是频繁触发的用户事件
+ 「水龙头」是节流阀，用于控制水的流速，即我们要实现的节流函数
+ 「水滴」是回调函数被执行
+ 「3秒」是时间间隔，3秒内至多滴下一滴水

函数节流的本质是降低回调函数的执行频率，适合及时需要给用户反馈的交互场景，例如，用户滚动页面触发scroll事件，刷新页面内容；用户点击页面按钮秒杀商品；[节流按钮](https://code.h5jun.com/gale/1/edit?js,output)等等。

### 2.节流的实现方式一

第一种是用时间戳来判断是否已到执行时间，记录上次执行的时间戳，然后每次触发事件执行回调，回调中判断当前时间戳距离上次执行时间戳的间隔是否已经达到时间差（Xms） ，如果是则执行，并更新上次执行的时间戳，如此循环。

```javascript
// 使用时间戳来判断距离上一次执行的时间
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
```

这种实现方式简单易懂，但是会受到前台系统时间的影响，需要慎用。

### 3.节流的实现方式二

第二种方法是使用定时器，比如当 scroll 事件刚触发时，打印一个 hello world，然后设置个 1000ms 的定时器，此后每次触发 scroll 事件触发回调，如果已经存在定时器，则回调不执行方法，直到定时器触发，handler 被清除，然后重新设置定时器。

```javascript
// 每次执行完回调函数后，设置定时器，一段时间后清除定时器ID。此后，每次事件触发时，如果已经存在定时器，则不触发，定时器清除了才会触发。
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
```

### 4.测试

我们通过nodejs运行如下测试代码比较两种实现方式，

```javascript
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
```

**测试结果**

![测试效果](./assets/_throttleDemo.gif)

通过上图可以看到，第一种实现方式会受到系统时间的影响，第二种实现方式更好。

## 三、总结

+ 函数节流和防抖是「闭包」、「高阶函数」的应用
+ 函数防抖的本质是延迟执行，函数节流的本质是降低回调函数的执行频率

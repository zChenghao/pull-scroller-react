export function throttle(fn: (...rest) => void, delay = 300) {
  let last = Date.now();
  return function () {
    const cur = Date.now();
    if (cur - last > delay) {
      fn.apply(this, [...arguments]);
      last = cur;
    }
  };
}

export function debounce(fn: (...rest) => void, delay = 300) {
  let timer;

  return function () {
    const args = [...arguments];
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      clearTimeout(timer);
      timer = null;
    }, delay);
  };
}

// 判断是否是 async 函数
export function isAsync(fn: () => any) {
  return fn.constructor.name === 'AsyncFunction';
}

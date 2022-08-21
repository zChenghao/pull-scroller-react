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
export function isAsync(fn: (...rest) => any) {
  return fn.constructor.name === 'AsyncFunction';
}

// 计算滚动距离
export function calcDistance(distance: number) {
  const tmp = distance.toString();
  const dis = parseInt(tmp, 10);
  if (dis === 0) return 0;
  if (dis > 0) return -dis;
  return Math.abs(dis);
}

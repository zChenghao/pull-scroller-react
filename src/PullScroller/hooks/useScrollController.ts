import { useCallback, useEffect, useState } from 'react';
import BScroll from '@better-scroll/core';
import PullDown from '@better-scroll/pull-down';
import Pullup from '@better-scroll/pull-up';
import { ScrollConstructor, ScrollerProps } from '../type';

BScroll.use(PullDown);
BScroll.use(Pullup);

export default function useScrollController(props: ScrollerProps, el: HTMLElement | string) {
  const [bScroller, setBScroller] = useState<ScrollConstructor>();
  const { isPreventDefault, enablePullDown, enablePullUp, pullDownConfig, pullUpConfig } = props;

  // 初始化滚动方法
  const initScroller = useCallback(
    (el: string | HTMLElement) => {
      console.log('init scroll');
      setBScroller(
        new BScroll(el, {
          click: true,
          stopPropagation: true,
          useTransition: false,
          preventDefault: isPreventDefault ?? true, // 是否阻止浏览器默认行为
          // probeType: 3
          // 下拉刷新配置
          pullDownRefresh: pullDownConfig || {
            threshold: 100,
            stop: 50
          },
          // 上拉加载
          // pullUpLoad: true
          pullUpLoad: pullUpConfig || {
            threshold: 0
          }
        })
      );
    },
    [isPreventDefault, , pullDownConfig, pullUpConfig]
  );

  // 初始化滚动
  useEffect(() => {
    if (el && !bScroller) {
      initScroller(el);
    }
    return () => {
      bScroller?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [el, initScroller]);

  useEffect(() => {
    if (bScroller) {
      console.log('scroller refresh');
      bScroller.refresh();
    }
  }, [bScroller, props.height, props.children]);

  useEffect(() => {
    if (enablePullDown) {
      bScroller?.openPullDown(
        pullDownConfig || {
          threshold: 100,
          stop: 50
        }
      );
    } else {
      bScroller?.closePullDown();
    }
    return () => {
      bScroller?.closePullDown();
    };
  }, [bScroller, enablePullDown, pullDownConfig]);

  useEffect(() => {
    if (enablePullUp) {
      bScroller?.openPullUp(
        pullUpConfig || {
          threshold: 0
        }
      );
    } else {
      bScroller?.closePullUp();
    }

    return () => {
      bScroller?.closePullUp();
    };
  }, [bScroller, enablePullUp, pullUpConfig]);

  // 销毁滚动
  useEffect(() => {
    return () => {
      if (bScroller) {
        console.log('destroy');
        bScroller.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { bScroller };
}

/* ============ 滚动事件相关 ============ */

// 计算 Y轴 滚动距离
// const calcScrollY = (y: number) => {
//   if (y > 0) return 0;
//   const dis = y.toString();
//   const scrollY = Math.abs(parseInt(dis, 10));
//   return scrollY;
// };

// // 更新 Y轴 滚动距离
// const updateScrollY = useCallback((y?: number) => {
//   if (y === undefined || y === null) return;
//   const scrollY = calcScrollY(y);
//   setScrollY(scrollY);
// }, []);

// // 滚动事件
// const scroll = useCallback(
//   (pos) => {
//     updateScrollY(pos.y);
//     const scrollY = calcScrollY(pos.y);
//     if (handleScroll) {
//       handleScroll.call(null, scrollY);
//     }
//   },
//   [handleScroll, updateScrollY]
// );

// useEffect(() => {
//   const scroller = bScroller?.scroller;
//   const translater = scroller?.translater.hooks;
//   const move = throttle(scroll, 500);
//   const scrollEnd = (pos) => {
//     updateScrollY(pos.y);
//   };
//   if (translater) {
//     console.log(translater);
//     translater.on('translate', move);
//     scroller.hooks.on('scrollEnd', scrollEnd);
//   }
//   return () => {
//     // console.log('off', translater?.events);
//     translater?.off('translate', move);
//     scroller?.hooks.off('scrollEnd', scrollEnd);
//   };
// }, [bScroller, scroll, updateScrollY]);

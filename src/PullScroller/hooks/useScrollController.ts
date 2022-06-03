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
      const pullDownCon = pullDownConfig ?? { threshold: 100, stop: 50 };
      const pullUpCon = pullUpConfig ?? { threshold: 0 };
      setBScroller(
        new BScroll(el, {
          click: true,
          stopPropagation: true,
          useTransition: false,
          preventDefault: isPreventDefault ?? true, // 是否阻止浏览器默认行为
          // probeType: 3
          // 下拉刷新配置
          pullDownRefresh: pullDownCon,
          // 上拉加载
          // pullUpLoad: true
          pullUpLoad: pullUpCon
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
      const pullDownCon = pullDownConfig ?? { threshold: 100, stop: 50 };
      bScroller?.openPullDown(pullDownCon);
    } else {
      bScroller?.closePullDown();
    }
    return () => {
      bScroller?.closePullDown();
    };
  }, [bScroller, enablePullDown, pullDownConfig]);

  useEffect(() => {
    if (enablePullUp) {
      const pullUpCon = pullUpConfig ?? { threshold: 0 };
      bScroller?.openPullUp(pullUpCon);
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

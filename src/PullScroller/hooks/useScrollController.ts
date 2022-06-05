import { useCallback, useEffect, useMemo, useRef } from 'react';
import BScroll from '@better-scroll/core';
import PullDown from '@better-scroll/pull-down';
import Pullup from '@better-scroll/pull-up';
import { ScrollConstructor, ScrollerProps } from '../type';

BScroll.use(PullDown);
BScroll.use(Pullup);

export default function useScrollController(props: ScrollerProps, el: HTMLElement | string) {
  const bscroller = useRef<ScrollConstructor>();
  const { enablePullDown, enablePullUp, isPreventDefault } = props;

  const pullDownCon = useMemo(() => props.pullDownConfig ?? { threshold: 100, stop: 50 }, [props.pullDownConfig]);
  const pullUpCon = useMemo(() => props.pullUpConfig ?? { threshold: 0 }, [props.pullUpConfig]);

  // 初始化滚动方法
  const initScroller = useCallback(
    (el: string | HTMLElement) => {
      console.log('init scroll');
      const baseConfig = {
        eventPassthrough: 'horizontal',
        click: true,
        stopPropagation: true,
        useTransition: true,
        preventDefault: isPreventDefault ?? true, // 是否阻止浏览器默认行为
        // probeType: 3
        // 下拉刷新配置
        pullDownRefresh: pullDownCon,
        // 上拉加载
        pullUpLoad: pullUpCon
      };

      return new BScroll(el, baseConfig);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPreventDefault]
  );

  // 初始化滚动
  useEffect(() => {
    if (el) {
      bscroller.current = initScroller(el);
    }
    // 销毁滚动
    return () => {
      if (bscroller.current) {
        console.log('destroy');
        bscroller.current.destroy();
      }
    };
  }, [el, initScroller]);

  // 重新计算 BetterScroll (当 DOM 结构发生变化的时候调用，确保滚动的效果正常)
  useEffect(() => {
    if (bscroller.current) {
      bscroller.current.refresh();
      console.log('refresh bScroller');
    }
  }, [props.height, props.children]);

  // 是否开始下拉刷新
  useEffect(() => {
    if (enablePullDown) {
      bscroller.current?.openPullDown(pullDownCon);
    } else {
      bscroller.current?.closePullDown();
    }
    return () => {
      bscroller.current?.closePullDown();
    };
  }, [enablePullDown, pullDownCon]);

  // 否开启上拉加载
  useEffect(() => {
    if (enablePullUp) {
      bscroller.current?.openPullUp(pullUpCon);
    } else {
      bscroller.current?.closePullUp();
    }

    return () => {
      bscroller.current?.closePullUp();
    };
  }, [enablePullUp, pullUpCon]);

  return { bScroller: bscroller.current };
}

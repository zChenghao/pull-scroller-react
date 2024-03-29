import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BScroll from '@better-scroll/core';
import PullDown from '@better-scroll/pull-down';
import Pullup from '@better-scroll/pull-up';
import ObserveImage from '@better-scroll/observe-image';
import { ScrollConstructor, ScrollerProps } from '../type';

BScroll.use(PullDown);
BScroll.use(Pullup);
BScroll.use(ObserveImage);

export function useScrollController(props: ScrollerProps, el: HTMLElement | string, contentHeight = 0) {
  const bscroller = useRef<ScrollConstructor | null | undefined>();
  const [bScroller, setBScroller] = useState<ScrollConstructor>();
  const {
    enablePullDown,
    enablePullUp,
    pullDownConfig,
    pullUpConfig,
    pullDownHandler,
    pullUpHandler,
    observeImg,
    extraConfig
  } = props;
  const pullDownCon = useMemo(
    () => (pullDownConfig === true ? pullDownConfig : { threshold: 90, stop: 40, ...pullDownConfig }),
    [pullDownConfig]
  );
  const pullUpCon = useMemo(() => pullUpConfig ?? true, [pullUpConfig]);

  // 初始化滚动方法
  const initScroller = useCallback(
    (el: string | HTMLElement) => {
      // console.log('init scroll');
      const extraOpt = extraConfig ?? {};
      const baseConfig = {
        click: true,
        stopPropagation: true,
        useTransition: false,
        // 下拉刷新配置
        pullDownRefresh: pullDownCon,
        // 上拉加载
        pullUpLoad: pullUpCon,
        ...extraOpt
      };
      // let conf: typeof baseConfig = { ...baseConfig };
      // if (observeImg) return new BScroll(el, { ...baseConfig, observeImage: observeImg });
      // return new BScroll(el, baseConfig);
      return observeImg ? new BScroll(el, { ...baseConfig, observeImage: observeImg }) : new BScroll(el, baseConfig);
    },
    [extraConfig, observeImg, pullDownCon, pullUpCon]
  );

  useEffect(() => {
    bscroller.current = bScroller;
  }, [bScroller]);

  // 初始化滚动
  useEffect(() => {
    if (el) {
      setBScroller(initScroller(el));
    }
    // 销毁滚动
    return () => {
      if (bscroller.current) {
        // console.log('destroy');
        bscroller.current.destroy();
      }
    };
  }, [el, initScroller]);

  // 重新计算 BetterScroll (当 DOM 结构发生变化的时候调用，确保滚动的效果正常)
  useEffect(() => {
    if (bscroller.current) {
      bscroller.current.refresh();
      // console.log('refresh bScroller');
    }
  }, [props.height, contentHeight]);

  // 是否开始下拉刷新
  useEffect(() => {
    const usePullDown = enablePullDown && pullDownHandler !== undefined;
    if (usePullDown) {
      bScroller?.openPullDown(pullDownCon);
    } else {
      bScroller?.closePullDown();
    }
    return () => {
      if (usePullDown) bScroller?.closePullDown();
    };
  }, [bScroller, enablePullDown, pullDownCon]);

  // 否开启上拉加载
  useEffect(() => {
    const usePullUp = enablePullUp && pullUpHandler !== undefined;
    if (usePullUp) {
      bScroller?.openPullUp(pullUpCon);
    } else {
      bScroller?.closePullUp();
    }

    return () => {
      if (usePullUp) bScroller?.closePullUp();
    };
  }, [bScroller, enablePullUp, pullUpCon]);

  return { bScroller };
}

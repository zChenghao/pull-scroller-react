import { useCallback, useEffect, useState } from 'react';
import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll';
import { debounce, throttle } from '../utils/utils';
import { ScrollProps } from '../type';

/* ============ 滚动事件相关 ============ */

export default function useScrollEvent(bScroller: BScrollConstructor | undefined, props: ScrollProps) {
  const [scrollY, setScrollY] = useState(0);
  const [switchBackTop, setSwitchBackTop] = useState(false);
  const { handleScroll, enableBackTop } = props;

  // 计算 Y轴 滚动距离
  const calcScrollY = (y: number) => {
    const dis = y.toString();
    const scrollY = parseInt(dis, 10);
    if (scrollY === 0) return scrollY;
    if (scrollY > 0) return -scrollY;
    return Math.abs(scrollY);
  };

  // 更新 Y轴 滚动距离
  const updateScrollY = useCallback((y?: number) => {
    if (y === undefined || y === null) return;
    const scrollY = calcScrollY(y);
    setScrollY(scrollY);
  }, []);

  // 滚动事件
  const scroll = useCallback(
    (pos) => {
      updateScrollY(pos.y);
      setSwitchBackTop(true);
      const scrollY = calcScrollY(pos.y);
      if (handleScroll) {
        handleScroll(scrollY);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleScroll]
  );

  // 回到顶部
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrollToTop = useCallback(
    debounce(() => {
      bScroller?.scrollTo(0, 0, 300, undefined);
    }),
    [bScroller]
  );

  useEffect(() => {
    const scroller = bScroller?.scroller;
    const translater = scroller?.translater.hooks;

    const move = throttle(scroll, 50);

    const scrollEnd = (pos) => {
      updateScrollY(pos.y);
      setSwitchBackTop(false);
    };

    if (translater && (handleScroll || enableBackTop)) {
      if (enableBackTop) setSwitchBackTop(false);
      console.log('bind scroll');
      console.log(translater);
      translater.on('translate', move);
      scroller.hooks.on('scrollEnd', scrollEnd);
    }
    return () => {
      if (handleScroll) {
        console.log('off scroll');
        translater?.off('translate', move);
        scroller?.hooks.off('scrollEnd', scrollEnd);
      }
    };
  }, [bScroller, enableBackTop, handleScroll, scroll, updateScrollY]);

  return { scrollY, switchBackTop, scrollToTop };
}

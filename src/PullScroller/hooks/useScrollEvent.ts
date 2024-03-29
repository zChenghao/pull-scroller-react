import { useCallback, useEffect, useMemo, useState } from 'react';
import { calcDistance, debounce, throttle } from '../utils/utils';
import { ScrollConstructor, ScrollProps } from '../type';

/* ============ 滚动事件相关 ============ */

export function useScrollEvent(bScroller: ScrollConstructor | undefined | null, props: ScrollProps) {
  const [scrollY, setScrollY] = useState(0);
  const [switchBackTop, setSwitchBackTop] = useState(true);
  const { handleScroll, backTop } = props;

  // BackTop show or hide
  const showBack = useMemo(() => switchBackTop && scrollY > 100, [scrollY, switchBackTop]);
  const showAlways = useMemo(() => scrollY > 100, [scrollY]);

  // 更新 Y轴 滚动距离
  const updateScrollY = useCallback((y?: number) => {
    if (y === undefined || y === null) return;
    const scrollY = calcDistance(y);
    setScrollY(scrollY);
    return scrollY;
  }, []);

  // 滚动事件
  const scroll = useCallback(
    (pos) => {
      const y = updateScrollY(pos.y);
      setSwitchBackTop(false);
      if (handleScroll && (y || y === 0)) handleScroll(y);
    },
    [handleScroll, updateScrollY]
  );

  // 回到顶部
  const scrollToTop = useCallback(
    debounce(() => {
      bScroller?.scrollTo(0, 0, 300, undefined);
    }),
    [bScroller]
  );

  useEffect(() => {
    const scroller = bScroller?.scroller.hooks;
    const hasEvent = scroller && (handleScroll || backTop);

    const move = throttle(scroll, 50);
    const scrollEnd = (pos) => {
      updateScrollY(pos.y);
      setSwitchBackTop(true);
    };

    if (hasEvent) {
      // console.log('bind scroll');
      scroller.on('scroll', move);
      scroller.on('scrollEnd', scrollEnd);
    }
    return () => {
      if (hasEvent) {
        // console.log('off scroll');
        if (scroller.eventTypes.scroll) scroller.off('scroll', move);
        if (scroller.eventTypes.scrollEnd) scroller.off('scrollEnd', scrollEnd);
      }
    };
  }, [bScroller, backTop, handleScroll, scroll, updateScrollY]);

  return { showBack, showAlways, scrollToTop };
}

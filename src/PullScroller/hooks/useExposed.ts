import { useCallback } from 'react';
import { EaseItem, ScrollConstructor, ExposedMethodsRef } from '../type';

export function useExposed(bScroller: ScrollConstructor | undefined): ExposedMethodsRef {
  const refresh = useCallback(() => {
    bScroller && bScroller.refresh();
  }, [bScroller]);

  const stop = useCallback(() => {
    bScroller && bScroller.stop();
  }, [bScroller]);

  const enable = useCallback(() => {
    bScroller && bScroller.enable();
  }, [bScroller]);

  const disable = useCallback(() => {
    bScroller && bScroller.disable();
  }, [bScroller]);

  const scrollTo = useCallback(
    (
      x: number,
      y: number,
      time?: number | undefined,
      easing?: EaseItem,
      extraTransform?: {
        start: object;
        end: object;
      }
    ) => {
      bScroller && bScroller.scrollTo(x, y, time, easing, extraTransform);
    },
    [bScroller]
  );

  const scrollBy = useCallback(
    (deltaX: number, deltaY: number, time?: number, easing?: EaseItem) => {
      bScroller && bScroller.scrollBy(deltaX, deltaY, time, easing);
    },
    [bScroller]
  );

  const scrollToElement = useCallback(
    (
      el: HTMLElement | string,
      time: number,
      offsetX: number | boolean,
      offsetY: number | boolean,
      easing?: EaseItem
    ) => {
      bScroller && bScroller.scrollToElement(el, time, offsetX, offsetY, easing);
    },
    [bScroller]
  );

  return { refresh, scrollTo, scrollBy, scrollToElement, stop, enable, disable };
}

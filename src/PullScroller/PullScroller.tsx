import { forwardRef, isValidElement, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useExposed, usePullDown, usePullUp, useScrollController, useScrollEvent } from './hooks';
import { ScrollerProps, ExposedMethodsRef } from './type';

// export default function PullScroller(props: ScrollerProps) {}
const PullScroller = forwardRef<ExposedMethodsRef, ScrollerProps>(function PullScroller(props, ref) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState<number>();
  const { pullDownLoader, pullUpLoader, backTop } = props;
  const { bScroller } = useScrollController(props, scrollRef.current as HTMLDivElement, contentHeight);
  const { scrollY, switchBackTop, scrollToTop } = useScrollEvent(bScroller, props);
  const { beforePullDown, isPullingDown, isPullDownError } = usePullDown(bScroller, props);
  const { beforePullUp, isPullingUp, isPullUpError } = usePullUp(bScroller, props);
  const methods = useExposed(bScroller);

  useImperativeHandle(ref, () => methods, [methods]);
  
  // const { refresh, stop, scrollTo, scrollBy, scrollToElement, enable, disable } = useExposed(bScroller);
  // useImperativeHandle(ref, () => ({ refresh, stop, scrollTo, scrollBy, scrollToElement, enable, disable }), [
  //   disable,
  //   enable,
  //   refresh,
  //   scrollBy,
  //   scrollTo,
  //   scrollToElement,
  //   stop
  // ]);

  useEffect(() => {
    // setContentHeight(container.current?.getBoundingClientRect().height);
    setContentHeight(container.current?.offsetHeight);
  }, [props.children]);

  // BackTop show or hide
  const showBack = useMemo(() => switchBackTop && scrollY > 100, [scrollY, switchBackTop]);
  const showAlways = useMemo(() => true && scrollY > 100, [scrollY]);

  const Refresher = useMemo(() => {
    if (pullDownLoader) {
      if (isValidElement(pullDownLoader)) {
        return pullDownLoader;
      }
      if (typeof pullDownLoader === 'function') {
        try {
          return pullDownLoader({ beforePullDown, isPullingDown, isPullDownError });
        } catch {
          return null;
        }
      }
      return null;
    }
    return <div style={{ padding: 13, textAlign: 'center' }}>Loading...</div>;
  }, [beforePullDown, isPullDownError, isPullingDown, pullDownLoader]);

  const PullUpLoader = useMemo(() => {
    if (pullUpLoader) {
      if (isValidElement(pullUpLoader)) {
        return pullUpLoader;
      }
      if (typeof pullUpLoader === 'function') {
        try {
          return pullUpLoader({ beforePullUp, isPullingUp, isPullUpError });
        } catch {
          return null;
        }
      }
      return null;
    }
    return <div style={{ padding: 13, textAlign: 'center' }}>Loading...</div>;
  }, [beforePullUp, isPullUpError, isPullingUp, pullUpLoader]);

  const BackToper = useMemo(() => {
    if (backTop) {
      if (isValidElement(backTop)) {
        return backTop;
      }
      if (typeof backTop === 'function') {
        try {
          return backTop({ handleScrollToTop: scrollToTop, show: showBack, showAlways });
        } catch {
          return null;
        }
      }
      return null;
    }
    return null;
  }, [backTop, scrollToTop, showAlways, showBack]);

  return (
    <div
      ref={scrollRef}
      className="pull_scroller"
      style={{ position: 'relative', overflowY: 'hidden', height: props.height || '100%' }}
    >
      <div>
        {props.enablePullDown ? (
          <div
            className="pulldown"
            style={{
              position: 'absolute',
              width: '100%',
              boxSizing: 'border-box',
              transform: 'translateY(-100%) translateZ(0)',
              overflow: 'hidden'
            }}
          >
            {Refresher}
          </div>
        ) : null}
        <div ref={container} className="scroller">
          {props.children}
        </div>
        {props.enablePullUp ? <div className="pullup">{PullUpLoader}</div> : null}
      </div>
      {BackToper}
    </div>
  );
});

export default PullScroller;

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useExposed, usePullDown, usePullUp, useScrollController, useScrollEvent } from './hooks';
import { makeUI } from './utils/makeUI';
import { ScrollerProps, ExposedMethodsRef } from './type';

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

  useEffect(() => {
    // setContentHeight(container.current?.getBoundingClientRect().height);
    setContentHeight(container.current?.offsetHeight);
  }, [props.children]);

  // BackTop show or hide
  const showBack = useMemo(() => switchBackTop && scrollY > 100, [scrollY, switchBackTop]);
  const showAlways = useMemo(() => scrollY > 100, [scrollY]);

  const Refresher = useMemo(() => {
    if (pullDownLoader) return makeUI(pullDownLoader, { beforePullDown, isPullingDown, isPullDownError });
    return <div style={{ padding: 13, textAlign: 'center' }}>Loading...</div>;
  }, [beforePullDown, isPullDownError, isPullingDown, pullDownLoader]);

  const PullUpLoader = useMemo(() => {
    if (pullUpLoader) return makeUI(pullUpLoader, { beforePullUp, isPullingUp, isPullUpError });
    return <div style={{ padding: 13, textAlign: 'center' }}>Loading...</div>;
  }, [beforePullUp, isPullUpError, isPullingUp, pullUpLoader]);

  const BackToper = useMemo(() => {
    if (backTop) return makeUI(backTop, { handleScrollToTop: scrollToTop, show: showBack, showAlways });
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
        <div ref={container} className="pull_container">
          {props.children}
        </div>
        {props.enablePullUp ? <div className="pullup">{PullUpLoader}</div> : null}
      </div>
      {BackToper}
    </div>
  );
});

export default PullScroller;

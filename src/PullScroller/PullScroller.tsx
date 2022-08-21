import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useExposed, usePullDown, usePullUp, useScrollController, useScrollEvent } from './hooks';
import { makeElement } from './utils/makeElement';
import { ScrollerProps, ExposedMethodsRef } from './type';

const PullScroller = forwardRef<ExposedMethodsRef, ScrollerProps>(function PullScroller(props, ref) {
  const { pullDownLoader, pullUpLoader, backTop } = props;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const { bScroller } = useScrollController(props, scrollRef.current as HTMLDivElement, contentHeight);
  const { showBack, showAlways, scrollToTop } = useScrollEvent(bScroller, props);
  const { beforePullDown, isPullingDown, isPullDownError } = usePullDown(bScroller, props);
  const { beforePullUp, isPullingUp, isPullUpError } = usePullUp(bScroller, props);
  const methods = useExposed(bScroller);

  useImperativeHandle(ref, () => methods, [methods]);

  useEffect(() => {
    // const h = container.current?.getBoundingClientRect().height ?? 0;
    const height = container.current?.offsetHeight ?? 0;
    setContentHeight(height);
  }, [props.children]);

  const Refresher = useMemo(() => {
    if (pullDownLoader) return makeElement(pullDownLoader, { beforePullDown, isPullingDown, isPullDownError });
    return <div style={{ padding: 13, textAlign: 'center' }}>Loading...</div>;
  }, [beforePullDown, isPullDownError, isPullingDown, pullDownLoader]);

  const PullUpLoader = useMemo(() => {
    if (pullUpLoader) return makeElement(pullUpLoader, { beforePullUp, isPullingUp, isPullUpError });
    return <div style={{ padding: 13, textAlign: 'center' }}>Loading...</div>;
  }, [beforePullUp, isPullUpError, isPullingUp, pullUpLoader]);

  const BackToper = useMemo(() => {
    if (backTop) return makeElement(backTop, { handleScrollToTop: scrollToTop, show: showBack, showAlways });
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

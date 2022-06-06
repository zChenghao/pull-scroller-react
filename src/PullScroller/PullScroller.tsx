import { isValidElement, useMemo, useRef } from 'react';
import { usePullDown, usePullUp, useScrollController, useScrollEvent } from './hooks';
import { ScrollerProps } from './type';

export default function PullScroller(props: ScrollerProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { bScroller } = useScrollController(props, scrollRef.current as HTMLDivElement);
  const { refresher, pullLoader, backTop } = props;

  const { scrollY, switchBackTop, scrollToTop } = useScrollEvent(bScroller, props);
  const { beforePullDown, isPullingDown, isRefreshError } = usePullDown(bScroller, props);
  const { beforePullUp, isPullUpLoading, isPullLoadError } = usePullUp(bScroller, props);

  const showBackTop = useMemo(() => !switchBackTop && scrollY > 300, [scrollY, switchBackTop]);

  const Refrehser = useMemo(() => {
    if (refresher) {
      if (isValidElement(refresher) || typeof refresher === 'string') {
        return refresher;
      }
      if (typeof refresher === 'function') {
        try {
          return refresher({ beforePullDown, isPullingDown, isRefreshError });
        } catch {
          return null;
        }
      }
      return null;
    }
    return null;
  }, [beforePullDown, isPullingDown, isRefreshError, refresher]);

  const PullLoader = useMemo(() => {
    if (pullLoader) {
      if (isValidElement(pullLoader) || typeof pullLoader === 'string') {
        return pullLoader;
      }
      if (typeof pullLoader === 'function') {
        try {
          return pullLoader({ beforePullUp, isPullUpLoading, isPullLoadError });
        } catch {
          return null;
        }
      }
      return null;
    }
    return null;
  }, [beforePullUp, isPullLoadError, isPullUpLoading, pullLoader]);

  const BackToper = useMemo(() => {
    if (backTop) {
      if (isValidElement(backTop) || typeof backTop === 'string') {
        return backTop;
      }
      if (typeof backTop === 'function') {
        try {
          return backTop({ handleScrollToTop: scrollToTop, show: showBackTop });
        } catch {
          return null;
        }
      }
      return null;
    }
    return null;
  }, [backTop, scrollToTop, showBackTop]);

  return (
    <div
      ref={scrollRef}
      className="loadscroll__wrapper"
      style={{ position: 'relative', overflowY: 'hidden', height: props.height || '100%' }}
    >
      <div>
        {props.enablePullDown ? (
          <div
            className="pulldown__wrapper"
            style={{
              position: 'absolute',
              width: '100%',
              boxSizing: 'border-box',
              transform: 'translateY(-100%) translateZ(0)'
            }}
          >
            {Refrehser ? Refrehser : <div style={{ textAlign: 'center', color: '#999' }}>Loading...</div>}
          </div>
        ) : null}
        {props.children}
        {props.enablePullUp ? (
          <div className="pullup__wrapper">
            {PullLoader ? (
              PullLoader
            ) : (
              <div style={{ padding: 15, textAlign: 'center', color: '#999' }}>Loading...</div>
            )}
          </div>
        ) : null}
      </div>
      {props.enableBackTop ? (
        <>
          {BackToper ? (
            BackToper
          ) : (
            <div
              style={{
                position: 'absolute',
                bottom: 50,
                right: 10,
                width: 50,
                height: 50,
                display: showBackTop ? undefined : 'none'
              }}
              onClick={scrollToTop}
            >
              Top
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

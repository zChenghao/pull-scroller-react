import { isValidElement, useMemo, useRef } from 'react';
import { DefaultBackTop, DefaultPullLoader, DefaultRefresher } from './components';
import { usePullDown, usePullUp, useScrollController, useScrollEvent } from './hooks';
import { ScrollerProps } from './type';

export default function PullScroller(props: ScrollerProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { bScroller } = useScrollController(props, scrollRef.current as HTMLDivElement);
  const { scrollY, switchBackTop, scrollToTop } = useScrollEvent(bScroller, props);
  const { beforePullDown, isPullingDown, isRefreshError } = usePullDown(bScroller, props);
  const { beforePullUp, isPullUpLoading, isPullLoadError } = usePullUp(bScroller, props);
  const { refresher, pullLoader, backTop } = props;

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
              transform: 'translateY(-100%) translateZ(0)',
              textAlign: 'center',
              color: '#999'
            }}
          >
            {Refrehser ? (
              Refrehser
            ) : (
              <DefaultRefresher
                beforePullDown={beforePullDown}
                isPullingDown={isPullingDown}
                isRefreshError={isRefreshError}
              />
            )}
          </div>
        ) : null}
        {props.children}
        {props.enablePullUp ? (
          <div className="pullup__wrapper">
            {PullLoader ? (
              PullLoader
            ) : (
              <DefaultPullLoader
                beforePullUp={beforePullUp}
                isPullUpLoading={isPullUpLoading}
                isPullLoadError={isPullLoadError}
              />
            )}
          </div>
        ) : null}
      </div>
      {props.enableBackTop ? (
        <>{BackToper ? BackToper : <DefaultBackTop show={showBackTop} handleScrollToTop={scrollToTop} />}</>
      ) : null}
    </div>
  );
}

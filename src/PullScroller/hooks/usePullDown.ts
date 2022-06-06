import { useCallback, useEffect, useState } from 'react';
import { ScrollConstructor, ScrollProps } from '../type';
import { isAsync } from '../utils/utils';

export default function usePullDown(
  bScroller: ScrollConstructor | undefined,
  { enablePullDown, handleRefresh }: ScrollProps
) {
  const [beforePullDown, setBeforePullDown] = useState(true);
  const [isPullingDown, setIsPullingDown] = useState(false);
  const [isRefreshError, setIsRefreshError] = useState(false);

  // finish 方法执行时，延时 300ms触发 BScroll.finishPullDown(),
  // 期间可以对刷新组件状态变化做控制，比如刷新完成友好提示，增加用户体验
  const finish = useCallback(
    (result?: boolean) => {
      if (bScroller) {
        // const tipsDelay = result ? 500 : 300;
        const tipsDelay = 300;
        console.log('finish pullDown');
        setIsPullingDown(false);
        if (result !== undefined) {
          setIsRefreshError(result);
        } else {
          setIsRefreshError(false);
        }
        setTimeout(() => {
          bScroller.finishPullDown();
        }, tipsDelay);
        setTimeout(() => {
          setBeforePullDown(true);
        }, tipsDelay + 50);
      }
    },
    [bScroller]
  );

  const pullingDownHandler = useCallback(async () => {
    console.log('trigger pullDown');
    if (handleRefresh) {
      const isasync = isAsync(handleRefresh);
      setBeforePullDown(false);
      setIsPullingDown(true);

      if (isasync) {
        // handleRefresh 是 async 函数，函数执行完，自动结束刷新
        // handleRefresh 是 async 函数时，handleRefresh方法不会接受 finish 函数为参数
        console.log('async callback');
        try {
          await handleRefresh();
          finish(false);
        } catch {
          finish(true);
        }
      } else {
        // handleRefresh 不是 async 函数，函数执行完，方法接受 finish方法为参数，你需要在自己代码逻辑中手动结束下拉刷新
        console.log('sync callback');
        handleRefresh(finish);
      }
    }
  }, [finish, handleRefresh]);

  useEffect(() => {
    const hasEvent = enablePullDown && bScroller && bScroller.eventTypes.pullingDown;
    if (hasEvent) {
      console.log('bind pullingDown');
      bScroller.on('pullingDown', pullingDownHandler);
    }
    return () => {
      if (hasEvent) {
        console.log('off pullingDown');
        bScroller.off('pullingDown', pullingDownHandler);
      }
    };
  }, [bScroller, enablePullDown, pullingDownHandler]);

  return { beforePullDown, isPullingDown, isRefreshError };
}

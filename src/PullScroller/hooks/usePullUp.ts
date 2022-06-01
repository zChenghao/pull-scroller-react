import { useCallback, useEffect, useState } from 'react';
import { isAsync } from '../utils/utils';
import { ScrollConstructor, ScrollProps } from '../type';

export default function usePullUp(
  bScroller: ScrollConstructor | undefined,
  { enablePullUp, handlePullUpLoad }: ScrollProps
) {
  const [beforePullUp, setBeforePullUp] = useState(true);
  const [isPullUpLoading, setIsPullUpLoad] = useState(false);
  const [isPullLoadError, setIsPullLoadError] = useState(false);

  const finish = useCallback(
    (result?: boolean) => {
      if (bScroller) {
        const tipDelay = result ? 500 : 350;
        // const tipDelay = 350;
        console.log('finish pullUp');
        setIsPullUpLoad(false);
        if (result !== undefined) {
          setIsPullLoadError(result);
        } else {
          setIsPullLoadError(false);
        }
        setTimeout(() => {
          bScroller.finishPullUp();
        }, 200);
        setTimeout(() => {
          setBeforePullUp(true);
        }, tipDelay);
      }
    },
    [bScroller]
  );

  const pullingUpHandler = useCallback(async () => {
    console.log('trigger pullUp');
    if (handlePullUpLoad) {
      const judgeAsync = isAsync(handlePullUpLoad);
      setBeforePullUp(false);
      setIsPullUpLoad(true);

      if (judgeAsync) {
        // handlePullUpLoad 是 async 函数，函数执行完，自动结束刷新
        // handlePullUpLoad 是 async 函数时，handlePullUpLoad 方法不会接受 finish 函数为参数
        console.log('async callback');
        try {
          await handlePullUpLoad();
          finish(false);
        } catch {
          finish(true);
        }
      } else {
        // handlePullUpLoad 不是 async 函数，函数执行完，方法接受 finish 方法为参数，你需要在自己代码逻辑中手动结束刷新
        console.log('sync callback');
        handlePullUpLoad(finish);
      }
    }
  }, [finish, handlePullUpLoad]);

  useEffect(() => {
    if (enablePullUp && bScroller) {
      console.log('bind pullLoad');
      bScroller.on('pullingUp', pullingUpHandler);
    }

    return () => {
      if (bScroller) {
        console.log('off pullLoad');
        bScroller.off('pullingUp', pullingUpHandler);
      }
    };
  }, [bScroller, enablePullUp, pullingUpHandler]);

  return { beforePullUp, isPullUpLoading, isPullLoadError };
}

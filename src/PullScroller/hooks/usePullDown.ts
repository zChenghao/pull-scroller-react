import { useCallback, useEffect, useState } from 'react';
import { isAsync } from '../utils/utils';
import {
  AsyncPullingHandler,
  FinishState,
  PullDownState,
  ScrollConstructor,
  ScrollProps,
  SyncPullingHandler
} from '../type';

export function usePullDown(
  bScroller: ScrollConstructor | undefined | null,
  { enablePullDown, pullDownHandler }: ScrollProps
): PullDownState {
  const [beforePullDown, setBeforePullDown] = useState(true);
  const [isPullingDown, setIsPullingDown] = useState(false);
  const [isPullDownError, setIsPullDownError] = useState(false);

  const finish = useCallback(
    (state?: FinishState) => {
      const { delay, error, immediately } = state ?? { delay: 300, error: false, immediately: false };
      // console.log(`delay: ${delay}, error: ${error}, immediately: ${immediately}`);
      if (bScroller) {
        console.log('finish pullDown');
        setIsPullingDown(false);
        error ? setIsPullDownError(error) : setIsPullDownError(false);
        if (immediately) {
          // finish immediately
          bScroller.finishPullDown();
          setBeforePullDown(true);
        } else {
          // finish delay
          let timer1;
          let timer2;
          const finishDelay = delay === undefined ? (error ? 400 : 300) : error ? delay + 100 : delay;
          const updateStateDelay = finishDelay + 100;

          timer1 = setTimeout(() => {
            bScroller.finishPullDown();
            clearTimeout(timer1);
            timer1 = null;
          }, finishDelay);

          timer2 = setTimeout(() => {
            setBeforePullDown(true);
            clearTimeout(timer2);
            timer2 = null;
          }, updateStateDelay);
        }
      }
    },
    [bScroller]
  );

  const pullingDownHandler = useCallback(async () => {
    console.log('trigger pullDown');
    if (pullDownHandler) {
      setBeforePullDown(false);
      setIsPullingDown(true);
      try {
        const flag = isAsync(pullDownHandler);
        if (flag) {
          // console.log('async callback');
          // pullDownHandler 是 async 函数，函数执行完，自动结束刷新
          // pullDownHandler 是 async 函数时，handleRefresh方法不会接受 finish 函数为参数
          const res = await (pullDownHandler as AsyncPullingHandler)();
          if (res) {
            finish(res);
          } else {
            finish();
          }
        } else {
          // console.log('sync callback');
          // pullDownHandler 是 sync 函数，函数执行完，方法接受 finish方法为参数，在自己代码中接收这个方法，手动结束刷新
          (pullDownHandler as SyncPullingHandler)(finish);
        }
      } catch (e: any) {
        finish({ error: true });
        if (e instanceof Error) throw e;
        throw new Error(JSON.stringify(e));
      }
    }
  }, [finish, pullDownHandler]);

  useEffect(() => {
    const hasEvent = enablePullDown && pullDownHandler !== undefined && bScroller && bScroller.eventTypes.pullingDown;
    if (hasEvent) {
      // console.log('bind pullingDown');
      bScroller.on('pullingDown', pullingDownHandler);
    }
    return () => {
      if (hasEvent) {
        // console.log('off pullingDown');
        bScroller.off('pullingDown', pullingDownHandler);
      }
    };
  }, [bScroller, enablePullDown, pullDownHandler, pullingDownHandler]);

  return { beforePullDown, isPullingDown, isPullDownError };
}

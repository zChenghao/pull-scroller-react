import { useCallback, useEffect, useState } from 'react';
import { isAsync } from '../utils/utils';
import {
  ScrollProps,
  ScrollConstructor,
  FinishState,
  PullUpState,
  AsyncPullingHandler,
  SyncPullingHandler
} from '../type';

export function usePullUp(
  bScroller: ScrollConstructor | undefined | null,
  { enablePullUp, pullUpHandler }: ScrollProps
): PullUpState {
  const [beforePullUp, setBeforePullUp] = useState(true);
  const [isPullingUp, setIsPullingUp] = useState(false);
  const [isPullUpError, setIsPullUpError] = useState(false);

  const finish = useCallback(
    (state?: FinishState) => {
      const { delay, error, immediately } = state ?? { delay: 300, error: false, immediately: false };
      // console.log(`delay: ${delay}, error: ${error}, immediately: ${immediately}`);
      if (bScroller) {
        console.log('finish pullUp');
        setIsPullingUp(false);
        error ? setIsPullUpError(error) : setIsPullUpError(false);

        if (immediately) {
          // finish immediately
          bScroller.finishPullUp();
          setBeforePullUp(true);
        } else {
          // finish delay
          let timer1;
          let timer2;
          const finishDelay = delay === undefined ? 300 : delay;
          const updateStateDelay = error ? finishDelay + 200 : finishDelay + 50;

          timer1 = setTimeout(() => {
            bScroller.finishPullUp();
            clearTimeout(timer1);
            timer1 = null;
          }, finishDelay);

          timer2 = setTimeout(() => {
            setBeforePullUp(true);
            clearTimeout(timer2);
            timer2 = null;
          }, updateStateDelay);
        }
      }
    },
    [bScroller]
  );

  const pullingUpHandler = useCallback(async () => {
    console.log('trigger pullUp');
    if (pullUpHandler) {
      setBeforePullUp(false);
      setIsPullingUp(true);

      try {
        const flag = isAsync(pullUpHandler);
        if (flag) {
          // console.log('async callback');
          // pullUpHandler 是 async 函数，函数执行完，自动结束下拉
          // pullUpHandler 是 async 函数时，handlePullUpLoad 方法不会接受 finish 函数为参数
          const res = await (pullUpHandler as AsyncPullingHandler)();
          if (res) {
            finish(res);
          } else {
            finish();
          }
        } else {
          // console.log('sync callback');
          // pullUpHandler 不是 async 函数，函数执行完，方法接受 finish 方法为参数，在自己代码中接收这个方法，手动结束上拉
          (pullUpHandler as SyncPullingHandler)(finish);
        }
      } catch (e: any) {
        finish({ error: true });
        if (e instanceof Error) throw e;
        throw new Error(JSON.stringify(e));
      }
    }
  }, [finish, pullUpHandler]);

  useEffect(() => {
    const hasEvent = enablePullUp && pullUpHandler !== undefined && bScroller && bScroller.eventTypes.pullingUp;
    if (hasEvent) {
      // console.log('bind pullingUp');
      bScroller.on('pullingUp', pullingUpHandler);
    }

    return () => {
      if (hasEvent) {
        // console.log('off pullingUp');
        bScroller.off('pullingUp', pullingUpHandler);
      }
    };
  }, [bScroller, enablePullUp, pullUpHandler, pullingUpHandler]);

  return { beforePullUp, isPullingUp, isPullUpError };
}

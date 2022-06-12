# pull-scroller-react v1.4.x

[1.3.x Docs](https://github.com/zChenghao/pull-scroller-react/tree/v1.3.x)

[Demos](https://github.com/zChenghao/demos-pull-scroller-react)

## Introduction

A scroll component based on React and Better-Scroll for mobile web app.

## Installation

```shell
npm install pull-scroller-react @better-scroll/core @better-scroll/pull-down @better-scroll/pull-up @better-scroll/observe-image
```

**Note: this component needs to run react > 16.8.**

## Usage

```javascript
import PullScroller from 'pull-scroller-react';
```

### Simple usage

```css
/* app.css */

.app{
  height: 100vh
}
```

```javascript
return (
  <div className="app">
    <PullScoller>
      <List list={list} />
    </PullScoller>
  </div>
);
```

### Using back-top

```javascript
function BackTopDemo() {
  const [list, setList] = useState<ListItem[]>([]);
  const { windowHeight } = useWindowHeight();

  useEffect(() => {
    mockGetListData(0, 50)
      .then((res) => {
        setList(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const BackTopMaker = useCallback(
    ({ handleScrollToTop, show }) => <BackTop scrollToTop={handleScrollToTop} show={show} />,
    []
  );

  return (
    <PullScroller height={windowHeight} backTop={BackTopMaker}>
      <DemoList list={list} />
    </PullScroller>
  );
}
```

### Using pull-down and pull-up

```javascript
function PullLoadDemo() {
  const { windowHeight } = useWindowHeight();
  const [list, setList] = useState<ListItem[]>([]);
  const [noMoreData, setNoMoreData] = useState(false);
  const pullDownConfig = useMemo(() => ({ threshold: 100, stop: 60 }), []);

  const refreshHandler: AsyncPullingHandler = useCallback(async () => {
   // your logic
  }, []);

  const loadMoreHandler: AsyncPullingHandler = useCallback(async () => {
    // your logic
  }, [noMoreData]);

  const refresher: PullDownMaker = useCallback(({ beforePullDown, isPullingDown, isPullDownError }) => {
    return (
      <PullDownLoader beforePullDown={beforePullDown} isPullingDown={isPullingDown} isRefreshError={isPullDownError} />
    );
  }, []);

  const pullLoader: PullUpMaker = useCallback(
    ({ beforePullUp, isPullingUp, isPullUpError }) => (
      <PullUpLoader
        beforePullUp={beforePullUp}
        isPullUpLoading={isPullingUp}
        isPullLoadError={isPullUpError}
        isNoMoreData={noMoreData}
      />
    ),
    [noMoreData]
  );

  return (
    <PullScroller
      height={windowHeight}
      enablePullDown
      pullDownConfig={pullDownConfig}
      pullDownHandler={refreshHandler}
      pullDownLoader={refresher}
      enablePullUp
      pullUpHandler={loadMoreHandler}
      pullUpLoader={pullLoader}
    >
      <List list={list} />
    </PullScroller>
  );
}
```

### Pull handler is an asynchronous function

```javascript
  // pull-down
  const refreshHandler = useCallback(async () => {
    try {
      const res = await mockGetListData(0, 30);
      // do something with res
      // ...
      // return { delay: 400 }; // Set the pull-down end action delay, default 300ms
    } catch (error) {
      // handle error
      // ...
      return { error: true }; // set PullScroller's isPullDownError: true
    }
  }, []);

  // pull-up
  const loadMoreHandler = useCallback(async () => {
    // no more data
    if (noMoreData && pageIndex.current >= pageTotal.current) {
      return { immediately: true }; // Immediately end the pull-up loading action
    }
    try {
      setNoMoreData(false);
      const res = await mockGetListData(pageIndex.current, 15);
      // do something with res
      // ...
      // return { delay: 200 }; // Set the pull-up end action delay, default 300ms
    } catch (error) {
      // handle error
      // ...
      return { error: true }; // set PullScroller's isPullUpError: true
    }
  }, [noMoreData]);
```

### Pull handler is a synchronization function

```javascript
  // pull-down
  const refreshHandler= useCallback((complete) => {
    mockGetListData(0, 30)
      .then((res) => {
        // do something with res
        // ...
        // finish pull-down
        // if (done) done({ delay: 400 }); // Set the pull-down end action delay, default 300ms
        complete && complete();
      })
      .catch((e) => {
        // handle error
        // ...
        // finish pull-down
        complete && complete({ error: true }); // set PullScroller's isPullDownError: true
      });
  }, []);

  // pull-up
  const loadMoreHandler = useCallback(
    (complete) => {
      if (noMoreData && pageIndex.current >= pageTotal.current) {
        complete && complete({ immediately: true }); // Immediately end the pull-up loading action
        return;
      }
      setNoMoreData(false);
      mockGetListData(pageIndex.current, 15)
        .then((res) => {
          // do something with res
          // ...
          // finish pull-up
          // complete && complete({ delay: 200 }); // Set the pull-up end action delay, default 300ms
          complete && complete(); // Set the pull-up end action delay, default 300ms
        })
        .catch((e) => {
          // handle error
          //...
          // finish pull-up
          complete && complete({ error: true }); // set PullScroller's isPullUpError:true
        });
    },
    [noMoreData]
  );
```

### Set horizontal scrolling

PullScroller only handles vertical scrolling and does not handle horizontal scrolling. If you want the page to scroll horizontally as well, you can set `{ eventPassthrough: 'horizontal' }` to make horizontal scrolling use native scrolling.  

Example:

```javascript
function App() {
  const [list, setList] = useState<ListItem[]>([]);
  const { windowHeight } = useWindowHeight();
  const config = useMemo(() =>({ eventPassthrough: 'horizontal' }),[]);

  useEffect(() => {
    mockGetListData(0, 50)
      .then((res) => {
        setList(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <PullScroller height={windowHeight} extraConfig={config}>
      <DemoList list={list} />
    </PullScroller>
  );
}
```

## Problems that may be encountered in use

+ When the page has `<img />`.It is possible that the page has been rendered but the image has not been loaded.The PullScoller component is unable to monitor picture loading completion,so after the image is loaded, refresh() is not triggered,this may causes problems with page scrolling.  
There are two recommended ways.  
  + If possible, set the width and height for the image or its parent container (this is the recommended way).  
  
  Set the image size directly
  
  style.module.css

  ```css
  .banner-img {
    width: 300px;
    height: 200px;
  }
  ```

  App.js

  ```javascript
  import style from './style.module.css';
  
  function App(){
     return (
      <PullScroller height={height: '100vh'}>
        <img className={style['banner-img']} src="imgurl" alt="" />
      </PullScroller>   
    );
  }
  ```
  
  Set the parent container size  

  style.module.css

  ```css
  .banner {
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
  }

  .banner-img {
    width: 100%;
  }
  ```

  App.js

  ```javascript
  import style from './style.module.css';
  
  function App(){
     return (
      <PullScroller height={height: '100vh'}>
        <div className={style.banner}>
          <img className={style['banner-img']} src="imgurl" alt="" />
        </div>
      </PullScroller>   
    );
  }
  
  ```

  + Using the @better-scroll/observe-image plugin. It is easy to use, just set the value of 'observeImg'.

  ```javascript
  function App(){
     return (
      <PullScroller
         height={height: '100vh'}
         observeImg={true}
         // or
         // observeImg={{ debounceTime: 100 }}
       >
        <img className={style['banner-img']} src="imgurl" alt="" />
      </PullScroller>   
    );
  }
  ```

  **Note: this is not recommended.This approach should not be used for scenarios where CSS has been used to determine the image width and height, because each call to Refresh has an impact on performance.  You only need it if the width or height of the image is uncertain.**

+ The PullScroller has elements inside that use native scroll.  
Examples:

```javascript
  function App(){
     return (
      <PullScroller height={height: '100vh'}>
          <div calss="wrapper" style={{ width: '100%', height: '200px', overflow: 'scroll' }}>
            <div style={{ width: '100%', height: '500px'}}></div>
          </div>
      </PullScroller>   
    );
  }
```

In this case, the wrapper may not scroll and the page may shake when sliding inside the wrapper.  
It may be a bit cumbersome to solve this problem, but there doesn't seem to be any good way to do it right now.  
You can solve the problem like this:

```javascript
  function App(){
    const wrapper = useRef(null);

    useEffect(() => {
      const dom = wrapper.current;
      const cb = (e) => {
        e.stopPropagation();
      };
      if (dom ) {
        dom.addEventListener('touchstart', cb);
      }

      return () => {
        setList([]);
        dom?.removeEventListener('touchstart', cb);
      };
    }, []);

    return (
      <PullScroller height={height: '100vh'}>
          <div ref={wrapper} calss="wrapper" style={{ width: '100%', height: '200px', overflow: 'scroll' }}>
            <div style={{ width: '100%', height: '500px'}}></div>
          </div>
      </PullScroller>   
    );
  }
```

+ The page has elements with `fixed` positioning.  
If a fixed positioned element is placed inside a scroll, fixed will fail because better-scroll uses transalate to simulate scrolling. So you should place the fixed element outside the PullScroller.

```javascript
function App() {

  // ...
  
  return (
    <>
      <div className="fixed">fixed</div>
      <PullScroller height={windowHeight}>
        <div>content</div>
      </PullScroller>
    </>
  )
}
```

[There is an example of a fixed tabbar.](https://github.com/zChenghao/demos-pull-scroller-react/blob/main/src/page/FixedTab/FixedTab.tsx)

## Props

+ height(default 100%): Height of scrolling area.The default value is '100%'.The value is of type string.(ex: '100px','100vh')  
This props is required in most cases.

+ handleScroll: Custom scroll event.When you want to do something while the page is scrolling.

+ enablePullDown: Whether to enable pull-down components.If the value is true, handleRefresh is required.

+ pullDownHandler: When pull-up is triggered, `pullDownHandler` will execute. It can be a synchronous function or an asynchronous function.  
When it's an 'async', pull-down will end automatically when `pullUpHandler` execution is finished. When it is a synchronous function, the method receives a `finish` method, and you need to call finish() in your code to end the pull-down.  
It provides three states that you can use to control your pull-down component.Of course you can also define your own state without using these three states.  
States: { beforePullDown: boolean; isPullingDown: boolean; isPullDownError: boolean; }

  + `finish`: it can receive a configuration object `{delay?: number; error?: boolean; immediately?: boolean;}`  
    + delay: the delay of finishing pull-down,default: 300ms.

    + error: set the value of `isPullDownError` provided by `PullScroller`, default value is `false`.  
    It indicates whether there is an error in the pull-down action. You can use the `isPullDownError` to control your pull-down component to display the error status.

    + immediately: whether to end the pull-down action immediately. If true, pull-down action will finish immediately after `pullUpHandler` is complete.The priority is higher than `delay`. Default value is false.

  + There are two ways to pass the configuration to `finish()`:  
    When pullDownHandler is an asynchronous function.

    ```javascript
      const pullDownHandler = async () => {
        try {
           const res = await getData();
          // do something width res
          // ....
          // return your configuration
          return { delay: 300, error: false, immediately: false };
        } catch (error) {
          // return your configuration
          return { error: false };
        }
      } 
    ```

    When pullDownHandler is a synchronization function:

    ```javascript
      const pullDownHandler = (complete) => {
        getData().then((res) => {
          // do something width res
          // ....
          // pass configuration when calling
          complete({delay: 300, error: false, immediately: false})
        }).catch((err) => {
           complete({ error: false })
        });
      } 
    ```

  **Note: This configuration is not required, depending on your actual usage. If not passed, the default value will be used.**

Source code:

```typescript
  // finish pull-down
  const finish = useCallback(
    (state?: FinishState) => {
      const { delay, error, immediately } = state ?? { delay: 300, error: false, immediately: false };
      if (bScroller) {
        // finish pullDown
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
    // trigger pullDown
    if (pullDownHandler) {
      setBeforePullDown(false);
      setIsPullingDown(true);
      try {
        const isasync = isAsync(pullDownHandler);
        if (isasync) {
          // async handler
          const res = await pullDownHandler();
          if (res) {
            finish(res);
          } else {
            finish();
          }
        } else {
          // sync handler
          pullDownHandler(finish);
        }
      } catch (e: any) {
        finish({ error: true });
        if (e instanceof Error) throw e;
        throw new Error(e);
      }
    }
  }, [finish, pullDownHandler]);
```

+ pullDownLoader: pull-down element or component. It is a function that returns JSX.Element, or a React element (which will not be displayed if it does not meet the conditions)

```typescript
  interface PullDownState {
    beforePullDown: boolean;
    isPullingDown: boolean;
    isPullDownError: boolean;
  }

  type PullDownMaker = (props: PullDownState) => ReactNode;

  interface ScrollProps {
    pullDownLoader?: PullDownMaker | ReactNode;
  }
```

+ pullDownConfig: pull-down config. When using custom refresh component this parameter may be required. Default value
is `true` (`= { threshold: 90, stop: 40 }`) ({ threshold?: number; stop?: number })  
threshold: the distance from the top drop-down to trigger the refresh, stop: rebound hover distance.  
You must define this value using either `useMemo` or `useState`, because this configuration accepts an object (the value of the reference type). If you pass objects directly into the component,each status update causes this value to be reassigned(the object references are not equal),this may cause the page to be unable to scroll.  

So you define the configuration like this

```javascript
  const pullDownConfig = useMemo(() => ({ threshold: 100, stop: 60 }), []); // Recommend
  // or
  const [pullDownConfig,setPullDownConfig] = useState({ threshold: 100, stop: 60 });
```

+ enablePullUp: Whether to enable pull-up components.If the value is true, handlePullUpLoad is required.

+ pullUpHandler: When pull-up is triggered, `pullUpHandler` will execute. It can be a synchronous function or an asynchronous function.  
When it's an 'async', pull-up will end automatically when `pullUpHandler` execution is finished. When it is a synchronous function, the method receives a `finish` method, and you need to call finish() in your code to end the pull-up.  
It provides three states that you can use to control your pull-up component. Of course you can also define your own state without using these three states.  
States: { beforePullUp: boolean; isPullingUp: boolean; isPullUpError: boolean; }

  + `finish`: it can receive a configuration object `{delay?: number; error?: boolean; immediately?: boolean;}`  
    + delay: the delay of finishing pull-up,default: 300ms.

    + error: set the value of `isPullUpError` provided by `PullScroller`, default value is `false`.  
    It indicates whether there is an error in the pull-up action. You can use the `isPullUpError` to control your pull-up component to display the error status.

    + immediately: whether to end the pull-up action immediately，If true, pull-up action will finish immediately after `pullUpHandler` is complete.The priority is higher than `delay`. Default value is `false`.

  + There are two ways to pass the configuration to `finish()`:  
    When pullUpHandler is an asynchronous function.

    ```javascript
      const pullUpHandler = async () => {
        try {
           const res = await getData();
          // do something width res
          // ....
          // return your configuration
          return { delay: 300, error: false, immediately: false };
        } catch (error) {
          // return your configuration
          return { error: false };
        }
      } 
    ```

    When pullUpHandler is a synchronous function.

    ```javascript
      const pullUpHandler = (complete) => {
        getData().then((res) => {
          // do something width res
          // ....
          // pass configuration when calling
          complete({delay: 300, error: false, immediately: false})
        }).catch((err) => {
           complete({ error: false })
        });
      } 
    ```

  **Note: This configuration is not required, depending on your actual usage. If not passed, the default value will be used.**

source code

```typescript
  // finish pull-up 
  const finish = useCallback(
    (state?: FinishState) => {
      const { delay, error, immediately } = state ?? { delay: 300, error: false, immediately: false };
      // console.log(`delay: ${delay}, error: ${error}, immediately: ${immediately}`);
      if (bScroller) {
        // finish pull-up
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
    // trigger pull-up
    if (pullUpHandler) {
      setBeforePullUp(false);
      setIsPullingUp(true);

      try {
        const judgeAsync = isAsync(pullUpHandler);
        if (judgeAsync) {
          // async handler
          const res = await pullUpHandler();
          if (res) {
            finish(res);
          } else {
            finish();
          }
        } else {
          // sync handler
          pullUpHandler(finish);
        }
      } catch (e: any) {
        finish({ error: true });
        if (e instanceof Error) throw e;
        throw new Error(e);
      }
    }
  }, [finish, pullUpHandler]);
```

+ pullUpLoader: pull-up element or component. It is a function that returns JSX.Element, or a React element (which will not be displayed if it does not meet the conditions)

```typescript
  interface PullUpState {
    beforePullUp: boolean;
    isPullingUp: boolean;
    isPullUpError: boolean;
  }

  type PullUpMaker = (props: PullUpState) => ReactNode;

  interface ScrollProps {
    pullUpLoader?: PullUpMaker | ReactNode;
  }
```

+ pullUpConfig: pull-up config. Default value is { threshold: 0 }(threshold: threshold for triggering the pull-up event, default is 0, you can set it to whatever value you want).  
You must define this value using either `useMemo` or `useState`, because this configuration accepts an object (the value of the reference type).If you pass objects directly into the component,each status update causes this value to be reassigned(the object references are not equal), this may cause the page to be unable to scroll.  

So you define the configuration like this

```javascript
  const pullUpConfig = useMemo(() => ({ threshold: 50 }), []); // recommend
  // or
  const [pullUpConfig,setPullUpConfig] = useState({ threshold: 50 });
```

+ backTop: back-top element or component. It is a function that returns JSX.Element, or a React element (which will not be displayed if it does not meet the conditions)

```typescript
  interface BackTopProps {
    handleScrollToTop: () => void;
    show: boolean;
    showAlways: boolean;
  }

  type BackTopMaker = (props: BackTopProps) => ReactNode;

  interface ScrollProps {
    backTop?: BackTopMaker | ReactNode;
  }
```

+ observeImg: Using ObserveImage Plugin. [Configuration](https://better-scroll.github.io/docs/en-US/plugins/observe-image.html#observeimage-options):

+ extraConfig: better-scroll configurations, will overrides the default configuration.You should define this value using either useMemo or useState,because this configuration accepts an object (the value of the reference type).If you pass objects directly into the component,each status update causes this value to be reassigned(the object references are not equal),this may cause the page to be unable to drag. ([Configurations](https://better-scroll.github.io/docs/en-US/guide/base-scroll-options.html))  

Ddefault configuration:

```javascript
  const baseConfig = {
    click: true,
    stopPropagation: true,
    useTransition: false,
    pullDownRefresh: pullDownCon,
    pullUpLoad: pullUpCon,
  };
```

## Deprecated props

**Notes: Deprecated props has been removed in the new release and is no longer supported.**

+ ~~isPreventDefault:  whether to block browser default behavior.(deprecated)~~

+ ~~enableBackTop: whether to enable back top components.~~

+ ~~handleRefresh: rename to pulldownhandler~~

+ ~~refresher: rename to pullDownLoader~~

+ ~~handlePullUpLoad: rename to pullUpHandler~~

+ ~~pullLoader: rename to pullUpLoader~~

## Props Interface

```typescript
import { PropsWithChildren, ReactNode } from 'react';
import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll';
import { PullDownRefreshOptions } from '@better-scroll/pull-down';
import { PullUpLoadOptions } from '@better-scroll/pull-up';
import { ObserveImageOptions } from '@better-scroll/observe-image';
import { Options } from '@better-scroll/core';

export interface PullDownState {
  beforePullDown: boolean;
  isPullingDown: boolean;
  isPullDownError: boolean;
}

export interface PullUpState {
  beforePullUp: boolean;
  isPullingUp: boolean;
  isPullUpError: boolean;
}

export interface BackTopProps {
  handleScrollToTop: () => void;
  show: boolean;
  showAlways: boolean;
}

export type PullDownMaker = (props: PullDownState) => ReactNode;
export type PullUpMaker = (props: PullUpState) => ReactNode;
export type BackTopMaker = (props: BackTopProps) => ReactNode;

export interface FinishState {
  delay?: number;
  error?: boolean;
  immediately?: boolean;
}

export type FinishHanlder = (state?: FinishState) => void;
export type SyncPullingHandler = (complete: FinishHanlder) => void;
export type AsyncPullingHandler = () => Promise<void | FinishState>;

export interface ScrollProps {
  readonly height?: string; // Height of scrolling area.The default value is '100%'
  readonly handleScroll?: (scrollY: number) => void; // custom scroll event
  // PullDown
  readonly enablePullDown?: boolean; // enable pulldown (refresh)
  readonly pullDownHandler?: SyncPullingHandler | AsyncPullingHandler; // pullDown handler
  readonly pullDownLoader?: PullDownMaker | ReactNode; // refresh component
  // pull down config. When using custom refresh component this parameter may be required
  readonly pullDownConfig?: true | { threshold?: number; stop?: number }; // default: true = {threshold: 90, stop: 40}
  // PullUp
  readonly enablePullUp?: boolean; // enable pullup (load more)
  readonly pullUpHandler?: SyncPullingHandler | AsyncPullingHandler; // pullUp handler
  readonly pullUpLoader?: PullUpMaker | ReactNode; // load more component
  // pull up config. When using custom load more component this parameter may be required
  readonly pullUpConfig?: true | { threshold: number }; // Threshold for triggering the pull-up event,default:true = {threshold:0}

  readonly backTop?: BackTopMaker | ReactNode; // back top element
  readonly observeImg?: ObserveImageOptions;
  readonly extraConfig?: Options;
}

export type ScrollerProps = PropsWithChildren<ScrollProps>;
```

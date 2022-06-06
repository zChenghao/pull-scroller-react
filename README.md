# pull-scroller-react v1.3.x

[Demos](https://github.com/zChenghao/demos-pull-scroller-react)

## Introduction

A scroll component based on React and Better-Scroll for mobile web app  

## Installation

```shell
npm install pull-scroller-react
```

**Note: This component needs to run react > 16.8,and the component is encapsulated in the Better-Scroll package.So you need to install dependencies in your project.**

```shell
npm install @better-scroll/core @better-scroll/pull-down @better-scroll/pull-up @better-scroll/observe-image
```

## Usage

```javascript
import PullScroller from 'pull-scroller-react';
```

### Simple usage

```javascript
return (
  <div className="app">
    <PullScoller
      height="100vh"
      enablePullDown
      enablePullUp
      enableBackTop
      handleRefresh={refresh}
      handlePullUpLoad={loadMore}
    >
      <List list={list} />
    </PullScoller>
  </div>
);
```

### Custom state components for loading, refreshing, and returning to the top

```javascript
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PullScoller, { PullLoaderMaker, RefresherMaker } from 'pull-scroller-react';
import { CustomBackTop, PullDownLoader, PullUpLoader } from '../../components/CustomLoaders';
import { DemoList } from '../../components';
import { ListItem, mockGetListData } from '../../utils/getMockData';

export default function CustomLoadersPage() {
  const pageIndex = useRef(0);
  const pageTotal = useRef(75);
  const [list, setList] = useState<ListItem[]>([]);
  const [enablePullUp, setEnablePullUp] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);

  const pullDownConfig = useMemo(() => ({ threshold: 120, stop: 60 }), []);

  useEffect(() => {
    mockGetListData(0, 30, 300)
      .then((res) => {
        setList(res);
        setEnablePullUp(true);
      })
      .catch((err) => {
        console.error(err);
      });
    return () => {
      setList([]);
    };
  }, []);

  useEffect(() => {
    pageIndex.current = list.length;
  }, [list]);

  const refresh = useCallback(async () => {
    const res = await mockGetListData(0, 30);
    setList(res);
  }, []);

  const loadMore = useCallback(async () => {
    if (noMoreData && pageIndex.current >= pageTotal.current) return;
    setNoMoreData(false);
    const res = await mockGetListData(pageIndex.current, 15);
    if (pageIndex.current < pageTotal.current) {
      setList((prev) => [...prev, ...res]);
    } else {
      console.log('set no more');
      setNoMoreData(true);
    }
  }, [noMoreData]);

  const refresher: RefresherMaker = useCallback(({ beforePullDown, isPullingDown, isRefreshError }) => {
    return (
      <PullDownLoader beforePullDown={beforePullDown} isPullingDown={isPullingDown} isRefreshError={isRefreshError} />
    );
  }, []);

  const pullLoader: PullLoaderMaker = useCallback(
    ({ beforePullUp, isPullUpLoading, isPullLoadError }) => (
      <PullUpLoader
        beforePullUp={beforePullUp}
        isPullUpLoading={isPullUpLoading}
        isPullLoadError={isPullLoadError}
        isNoMoreData={noMoreData}
      />
    ),
    [noMoreData]
  );

  const BackTop = useCallback(
    ({ handleScrollToTop, show }) => <CustomBackTop show={show} scrollToTop={handleScrollToTop} />,
    []
  );

  return (
    <PullScoller
      height="100vh"
      enablePullDown
      enablePullUp={enablePullUp}
      enableBackTop
      pullDownConfig={pullDownConfig}
      handleRefresh={refresh}
      handlePullUpLoad={loadMore}
      refresher={refresher}
      pullLoader={pullLoader}
      backTop={BackTop}
    >
      <DemoList list={list} />
    </PullScoller>
  );
}
```

## Possible problems in use

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
      <LoadScroll height={height: '100vh'}>
        <img className={style['banner-img']} src="imgurl" alt="" />
      </LoadScroll>   
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
      <LoadScroll height={height: '100vh'}>
        <div className={style.banner}>
          <img className={style['banner-img']} src="imgurl" alt="" />
        </div>
      </LoadScroll>   
    );
  }
  ```

  + Using the @better-scroll/observe-image plugin. It is easy to use, just set the value of 'observeImg'.

  ```javascript
  function App(){
     return (
      <LoadScroll
         height={height: '100vh'}
         observeImg={true}
         // or
         // observeImg={{ debounceTime: 100 }}
       >
        <img className={style['banner-img']} src="imgurl" alt="" />
      </LoadScroll>   
    );
  }
  ```

  **Note:This is not recommended.This approach should not be used for scenarios where CSS has been used to determine the image width and height, because each call to Refresh has an impact on performance.  You only need it if the width or height of the image is uncertain.**

+ The PullScroller has elements inside that use native scroll.  
Examples:

```javascript
  function App(){
     return (
      <LoadScroll height={height: '100vh'}>
          <div calss="wrapper" style={{ width: '100%', height: '200px', overflow: 'scroll' }}>
            <div style={{ width: '100%', height: '500px'}}></div>
          </div>
      </LoadScroll>   
    );
  }
```

In this case, the wrapper may not scroll and the page may shake when sliding inside the wrapper.  
It may be a bit cumbersome to solve this problem, but there doesn't seem to be any good way to do it right now.  
You can solve the problem like this:

```javascript
  import { useEffect, useRef } from 'react';

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
        dom ?.removeEventListener('touchstart', cb);
      };
    }, []);

    return (
      <LoadScroll height={height: '100vh'}>
          <div ref={wrapper} calss="wrapper" style={{ width: '100%', height: '200px', overflow: 'scroll' }}>
            <div style={{ width: '100%', height: '500px'}}></div>
          </div>
      </LoadScroll>   
    );
  }
```

## Props

+ height(default 100%) —— Height of scrolling area.The default value is '100%'.The value is of type string.(ex: '100px','100vh')  
This props is required in most cases.

+ enablePullDown —— Whether to enable pull-down components.If the value is true, handleRefresh is required.

+ enablePullUp —— Whether to enable pull-up components.If the value is true, handlePullUpLoad is required.

+ enableBackTop —— Whether to enable back top components.

+ pullDownConfig —— Pull down config.When using custom refresh component this parameter may be required.Default value
is { threshold: 90, stop: 40 } (threshold: the distance from the top drop-down to trigger the refresh. stop: rebound hover distance).You must define this value using either useMemo or useState,because this configuration accepts an object (the value
of the reference type).If you pass objects directly into the component,each status update causes this value to be reassigned(the object references are not equal),this may cause the page to be unable to drag.  

So you define the configuration like this

```javascript
  const pullDownConfig = useMemo(() => ({ threshold: 150, stop: 100 }), []); // Recommend
  // or
  const [pullDownConfig,setPullDownConfig] = useState({ threshold: 150, stop: 100 });
```

+ pullUpConfig —— Pull up config. Default value is { threshold: 0 }(threshold: threshold for triggering the pull-up event, default is 0, you can set it to whatever value you want).You must define this value using either useMemo or useState,because
this configuration accepts an object (the value of the reference type).If you pass objects directly into the component,each status update causes this value to be reassigned(the object references are not equal),this may cause the page to be unable
to drag.  

So you define the configuration like this

```javascript
  const pullUpConfig = useMemo(() => ({ threshold: 50 }), []); // Recommend
  // or
  const [pullUpConfig,setPullUpConfig] = useState({ threshold: 50 });
```

+ handleScroll —— Custom scroll event.When you want to do something while the page is scrolling.

+ handleRefresh —— The event handler that executes when the pull-down triggers.It can be a normal function or an asyn function.
When it's an async function,the function completes and the pull-down automatically ends.When it is not an async function, the method receives a finish method, and you need to manually terminate the pull-down refresh in your own code logic.  

source code:

```javascript
  /*
    Bscroll.finishpulldown () is triggered when the finish method is executed after 300ms.
    During the refresh component state changes can be controlled, 
    such as refresh complete friendly prompt, increase user experience
  */
  const finish = useCallback(
    (result?: boolean) => {
      if (bScroller) {
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
        // console.log('async callback');
        try {
          await handleRefresh();
          finish(false);
        } catch {
          finish(true);
        }
      } else {
        // console.log('sync callback');
        handleRefresh(finish);
      }
    }
  }, [finish, handleRefresh]);
```

+ handlePullUpLoad —— The event handler that executes when the pull-up triggers.It can be a normal function or an asyn function.
When it's an async function,the function completes and the pull-up automatically ends.When it is not an async function, the method receives a finish method,and you need to manually terminate the pull-up in your own code logic.  
source code

```javascript
  const finish = useCallback(
    (result?: boolean) => {
      if (bScroller) {
        const tipDelay = result ? 500 : 350;
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
        // console.log('async callback');
        try {
          await handlePullUpLoad();
          finish(false);
        } catch {
          finish(true);
        }
      } else {
        // console.log('sync callback');
        handlePullUpLoad(finish);
      }
    }
  }, [finish, handlePullUpLoad]);
```

+ refresher —— Custom refresh component.

+ pullLoader —— Custom load more component.

+ backTop —— Custom return back top component.

+ observeImg —— Using ObserveImage Plugin.

+ extraConfig —— better-scroll configurations, will overrides the default configuration.You should define this value using either useMemo or useState,because this configuration accepts an object (the value of the reference type).If you pass objects directly into the component,each status update causes this value to be reassigned(the object references are not equal),this may cause the page to be unable to drag. ([Configurations](https://better-scroll.github.io/docs/en-US/guide/base-scroll-options.html))  

Ddefault configuration:

```javascript
  const baseConfig = {
    eventPassthrough: 'horizontal',
    click: true,
    stopPropagation: true,
    useTransition: true,
    pullDownRefresh: pullDownCon,
    pullUpLoad: pullUpCon,
  };
```

## Deprecated props

**Notes: Deprecated props has been removed in the new release and is no longer supported.**

+ ~~isPreventDefault ——  Whether to block browser default behavior.(deprecated)~~

## Props Interface

```typescript
interface RefresherProps {
  beforePullDown: boolean;
  isPullingDown: boolean;
  isRefreshError: boolean;
}

interface PullLoaderProps {
  beforePullUp: boolean;
  isPullUpLoading: boolean;
  isPullLoadError: boolean;
}

interface BackTopProps {
  handleScrollToTop: () => void;
  show: boolean;
}

type RefresherMaker = (props: RefresherProps) => ReactNode;

type PullLoaderMaker = (props: PullLoaderProps) => ReactNode;

type BackToperMaker = (props: BackTopProps) => ReactNode;

interface ScrollProps {
  readonly height?: string; // Height of scrolling area.The default value is '100%'
  readonly enablePullDown?: boolean; // enable pulldown (refresh)
  readonly enablePullUp?: boolean; // enable pullup (load more)
  readonly enableBackTop?: boolean; // enable back top
  // pull down config. When using custom refresh component this parameter may be required
  readonly pullDownConfig?: {
    threshold: number; // The distance from the top drop-down to trigger the refresh. The default value is 100
    stop: number; // Rebound hover distance. The default value is 50
  };
  // pull up config. When using custom load more component this parameter may be required
  readonly pullUpConfig?: {
    threshold: number; // Threshold for triggering the pull-up event.The default value is 0
  };
  readonly handleScroll?: (scrollY: number) => void; // custom scroll event
  readonly handleRefresh?: (complete?: () => void) => void | Promise<any>; // refresh handler
  readonly handlePullUpLoad?: (complete?: () => void) => void | Promise<any>; // pull up load handler
  readonly refresher?: RefresherMaker | ReactNode; // custom refresh component
  readonly pullLoader?: PullLoaderMaker | ReactNode; // custom load more component
  readonly backTop?: BackToperMaker | ReactNode; // custom return back top component
  readonly observeImg?: ObserveImageOptions; // Using ObserveImage Plugin
  readonly extraConfig?: Options; // better-scroll configurations, will overrides the default configuration.
}
```

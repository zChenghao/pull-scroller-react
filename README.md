# pull-scroller-react

A scroll component based on React and Better-Scroll for mobile web app  

## Installation

npm install pull-scroller-react  

or  

yarn add pull-scroller-react

**Note: This component needs to run react > 16.8,and the component is encapsulated in the Better-Scroll package.So you need to install dependencies in your project.**

npm install @better-scroll/core @better-scroll/pull-down @better-scroll/pull-up

## Usage

```javascript
import PullScroller from '@pull-scroller/react';
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
      handlePullUpLoad={asyncCallback}
    >
      <List list={list} />
    </PullScoller>
  </div>
);
```

### Custom state components for loading, refreshing, and returning to the top

```javascript
function App() {
  const [list, setList] = useState<string[]>([]);
  const [noMoreData, setNoMoreData] = useState(false);
  const listCount = useRef(0);

  const addListData = useCallback((start = 0, count = 15) => {
    const end = start + count;
    console.log(`add start is ${start},end is ${end}`);
    // console.log('add list item');
    if (!start) setList([]);
    for (let i = start; i < end; i++) {
      setList((prev) => [...prev, `This is item${i}`]);
    }
  }, []);

  useEffect(() => {
    if (!list.length) {
      addListData(0, 30);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    listCount.current = list.length;
  }, [list]);

  // Mock request
  const getData = async (time) => {
    const res = await timeout(time);
    console.log(`getData ${res}`);
    return `get ${res}`;
  };

  const refresh = useCallback(
    (done) => {
      getData(1000).then((res) => {
        console.log('refresh', res);
        listCount.current = 0;
        addListData(0, 30);
        done();
      });
    },
    [addListData]
  );

  const loadMore = useCallback(
    (complete) => {
      if (noMoreData && listCount.current >= 75) {
        complete();
        return;
      }
      setNoMoreData(false);
      getData(1000).then((res) => {
        console.log('load more', res);
        if (listCount.current < 75) {
          addListData(listCount.current);
        } else {
          setNoMoreData(true);
        }
        complete();
      });
    },
    [addListData, noMoreData]
  );

  const asyncCallback = useCallback(async () => {
    if (noMoreData && listCount.current >= 75) return;
    setNoMoreData(false);
    const res = await getData(1000);
    console.log('===== do something by using res ======');
    console.log('microtask exec', res);
    if (listCount.current < 75) {
      addListData(listCount.current);
    } else {
      setNoMoreData(true);
    }
  }, [addListData, noMoreData]);

  const refresher: RefresherMaker = useCallback(({ beforePullDown, isPullingDown, isRefreshError }) => {
    return (
      <CustomRefresher beforePullDown={beforePullDown} isPullingDown={isPullingDown} isRefreshError={isRefreshError} />
    );
  }, []);

  const pullLoader = useCallback(
    ({ beforePullUp, isPullUpLoading, isPullLoadError }) => (
      <CustomPullLoader
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
    <div className="app">
      <PullScoller
        height="100vh"
        enablePullDown
        enablePullUp
        enableBackTop
        handleRefresh={refresh}
        handlePullUpLoad={asyncCallback}
        refresher={refresher}
        pullLoader={pullLoader}
        backTop={BackTop}
      >
       <List list={list} />
      </PullScoller>
    </div>
  );
}
```

## Props Interface

```typescript
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
  readonly isPreventDefault?: boolean; // Whether to block browser default behavior
}
```

declare module 'pull-scroller-react' {
  import { PropsWithChildren, ReactNode } from 'react';
  import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll';
  import { PullDownRefreshOptions } from '@better-scroll/pull-down';
  import { PullUpLoadOptions } from '@better-scroll/pull-up';

  interface BScrollPluginAPI {
    finishPullDown(): void;
    openPullDown(config?: PullDownRefreshOptions): void;
    closePullDown(): void;
    autoPullDownRefresh(): void;
    finishPullUp(): void;
    openPullUp(config?: PullUpLoadOptions): void;
    closePullUp(): void;
    autoPullUpLoad(): void;
  }

  export interface RefresherProps {
    beforePullDown: boolean;
    isPullingDown: boolean;
    isRefreshError: boolean;
  }
  export interface PullLoaderProps {
    beforePullUp: boolean;
    isPullUpLoading: boolean;
    isPullLoadError: boolean;
  }
  export interface BackTopProps {
    handleScrollToTop: () => void;
    show: boolean;
  }
  export type RefresherMaker = (props: RefresherProps) => ReactNode;
  export type PullLoaderMaker = (props: PullLoaderProps) => ReactNode;
  export type BackToperMaker = (props: BackTopProps) => ReactNode;

  export interface ScrollProps {
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

  export type ScrollerProps = PropsWithChildren<ScrollProps>;
  export type ScrollConstructor = BScrollConstructor & BScrollPluginAPI;

  export default function PullScroller(props: ScrollerProps): JSX.Element;
}

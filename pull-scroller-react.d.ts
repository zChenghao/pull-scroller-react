declare module 'pull-scroller-react' {
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
  
  export interface PluginAPI {
    finishPullDown(): void;
    openPullDown(config?: PullDownRefreshOptions): void;
    closePullDown(): void;
    autoPullDownRefresh(): void;
    finishPullUp(): void;
    openPullUp(config?: PullUpLoadOptions): void;
    closePullUp(): void;
    autoPullUpLoad(): void;
  }
  
  export type ScrollConstructor = BScrollConstructor & PluginAPI;
  
  export interface EaseItem {
    style: string;
    fn: (t: number) => number;
  }
  
  export interface ExposedMethodsRef {
    refresh(): void;
    stop(): void;
    enable(): void;
    disable(): void;
    scrollTo(
      x: number,
      y: number,
      time?: number,
      easing?: EaseItem,
      extraTransform?: {
        start: object;
        end: object;
      }
    ): void;
    scrollBy(deltaX: number, deltaY: number, time?: number, easing?: EaseItem): void;
    scrollToElement(
      el: HTMLElement | string,
      time: number,
      offsetX: number | boolean,
      offsetY: number | boolean,
      easing?: EaseItem
    ): void;
  }
}

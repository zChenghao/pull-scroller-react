import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll';
import { PullDownRefreshOptions } from '@better-scroll/pull-down';
import { PullUpLoadOptions } from '@better-scroll/pull-up';
import { PropsWithChildren, ReactNode } from 'react';

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
  readonly height?: string;
  readonly isPreventDefault?: boolean;
  readonly enablePullDown?: boolean;
  readonly enablePullUp?: boolean;
  readonly enableBackTop?: boolean;
  readonly handleScroll?: (scrollY: number) => void;
  readonly handleRefresh?: (complete?: () => void) => void | Promise<any>;
  readonly handlePullUpLoad?: (complete?: () => void) => void | Promise<any>;
  readonly refresher?: RefresherMaker | ReactNode;
  readonly pullLoader?: PullLoaderMaker | ReactNode;
  readonly backTop?: BackToperMaker | ReactNode;
}

export type ScrollerProps = PropsWithChildren<ScrollProps>;

export type ScrollConstructor = BScrollConstructor & BScrollPluginAPI;

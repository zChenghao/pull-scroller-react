import { memo } from 'react';
import { PullLoaderProps } from '../type';

export const DefaultPullLoader = memo(({ beforePullUp, isPullUpLoading, isPullLoadError }: PullLoaderProps) => {
  return (
    <div style={{ padding: 20, textAlign: 'center', fontSize: 16, color: '#999' }}>
      <div style={{ display: beforePullUp ? undefined : 'none' }}>
        <span>Pull up and load more</span>
      </div>
      <div style={{ display: !beforePullUp ? undefined : 'none' }}>
        <div style={{ display: isPullUpLoading ? undefined : 'none' }}>
          <span>Loading...</span>
        </div>
        <div style={{ display: !isPullUpLoading ? undefined : 'none' }}>
          <span>{isPullLoadError ? 'Load error' : 'Loading completed'}</span>
        </div>
      </div>
    </div>
  );
});

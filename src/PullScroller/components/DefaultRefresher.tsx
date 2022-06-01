import { memo } from 'react';
import { RefresherProps } from '../type';

export const DefaultRefresher = memo(({ beforePullDown, isPullingDown, isRefreshError }: RefresherProps) => {
  return (
    <div style={{ fontSize: 16, lineHeight: 1, padding: '17px 20px' }}>
      <div style={{ display: beforePullDown ? undefined : 'none' }}>
        <span>Pull Down and refresh</span>
      </div>
      <div style={{ display: !beforePullDown ? undefined : 'none' }}>
        <div style={{ display: isPullingDown ? undefined : 'none' }}>
          <span>Loading...</span>
        </div>
        <div style={{ display: !isPullingDown ? undefined : 'none' }}>
          <span>{isRefreshError ? 'Refresh fail' : 'Refresh success'}</span>
        </div>
      </div>
    </div>
  );
});

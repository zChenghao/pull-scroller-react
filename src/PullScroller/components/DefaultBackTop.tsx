import React, { memo } from 'react';
import { BackTopProps } from '../type';

export const DefaultBackTop: React.FC<BackTopProps> = memo(({ show, handleScrollToTop }) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 50,
        right: 10,
        width: 50,
        height: 50,
        lineHeight: '50px',
        textAlign: 'center',
        fontSize: 14,
        background: '#fff',
        borderRadius: '50%',
        boxShadow: ' 0 0 5px rgba(0, 0, 0, .3)',
        display: show ? undefined : 'none'
      }}
      onClick={handleScrollToTop}
    >
      Top
    </div>
  );
});

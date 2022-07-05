import { isValidElement, ReactNode } from 'react';
import { BackTopMaker, PullDownMaker, PullUpMaker } from '../type';

export function makeElement(maker: ReactNode | PullDownMaker | PullUpMaker | BackTopMaker, props) {
  if (isValidElement(maker)) return maker;
  if (typeof maker === 'function') {
    try {
      return maker(props);
    } catch {
      return null;
    }
  }
  return null;
}

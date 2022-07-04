import { isValidElement, ReactNode } from 'react';
import { BackTopMaker, PullDownMaker, PullUpMaker } from '../type';

export function makeUI(maker: ReactNode | PullDownMaker | PullUpMaker | BackTopMaker, states) {
  if (isValidElement(maker)) return maker;
  if (typeof maker === 'function') {
    try {
      return maker(states);
    } catch {
      return null;
    }
  }
  return null;
}

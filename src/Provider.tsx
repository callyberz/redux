import React, { createContext } from 'react';
import { reducer, Redux, Action, Counter } from './redux';

export const StoreContext = createContext<null | {
  dispatch: (action: Action) => void;
  subscribe: (listener: () => void) => () => void;
  getState: () => Counter;
}>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = Redux.createStore(reducer);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

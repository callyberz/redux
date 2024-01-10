import React, { createContext } from 'react';
import { Action, reducer, Redux, ReduxStore } from './redux';

function logger({ getState }: ReduxStore) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (next: any) => (action: Action) => {
    console.log('*** Logger ***: will dispatch', { next, action });
    const returnValue = next(action);
    console.log('*** Logger ***: state after dispatch', getState());
    return returnValue;
  };
}

function sideEffects({ getState, dispatch }: ReduxStore) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (next: any) => (action: any) => {
    console.log('*** sideEffects ***: will dispatch', { next, action });

    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    return next(action);
  };
}

export const StoreContext = createContext<ReduxStore | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = Redux.createStore(
    reducer,
    Redux.applyMiddleware(sideEffects, logger)
  );

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

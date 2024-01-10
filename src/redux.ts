export interface Counter {
  count: number;
}

export interface Action {
  type: string;
}

export interface ReduxStore {
  dispatch: (action: Action) => void;
  subscribe: (listener: () => void) => () => void;
  getState: () => Counter;
}

export enum ActionTypes {
  INCREMENT = 'counter/incremented',
  DECREMENT = 'counter/decremented'
}

export const initialState: Counter = {
  count: 0
};

// reducer: takes the current state and an action as arguments, and returns a new state result.
export function reducer(
  state: Counter = initialState,
  action: Action
): Counter {
  switch (action.type) {
    case ActionTypes.INCREMENT:
      return { ...state, count: state.count + 1 };
    case ActionTypes.DECREMENT:
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

function createStore(
  reducer: (state: Counter, action: Action) => Counter,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enhancer?: any
) {
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }
  let state = reducer(initialState, { type: '' });
  const listeners: (() => void)[] = []; // array of listener functions
  return {
    dispatch: (action: Action) => {
      // dispatch action
      state = reducer(state, action);
      // notify subscribers
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      // notify subscribers
      listeners.push(listener);
      // return unsubscribe function
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    },
    getState: () => state
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function compose(...fns: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (x: any) => fns.reduceRight((v, f) => f(v), x);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
function applySingleMiddleware(middleware: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (createStore: any) => (reducer: any) => {
    const store = createStore(reducer);

    return {
      ...store,
      dispatch: middleware({
        getState: store.getState,
        dispatch: store.dispatch
      })
    };
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyMiddleware(...middlewares: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (createStore: any) => (reducer: any, preloadedState: any) => {
    const store = createStore(reducer, preloadedState);

    let dispatch = store.dispatch;
    const middlewareAPI = {
      getState: store.getState,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch: (action: any) => dispatch(action)
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chain = middlewares.map((middleware: any) =>
      middleware(middlewareAPI)
    );
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch
    };
  };
}

export const Redux = {
  createStore,
  applyMiddleware,
  compose
};

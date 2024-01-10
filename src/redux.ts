export interface Counter {
  count: number;
}

export interface Action {
  type: string;
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

function createStore(reducer: (state: Counter, action: Action) => Counter) {
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

export const Redux = {
  createStore
};

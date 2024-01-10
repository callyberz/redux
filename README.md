# Simple Redux from scratch

This is a simple Redux implementation from scratch. It is based on the [Redux Fundamentals](https://redux.js.org/tutorials/fundamentals/part-1-overview) tutorial.

![Flowchart](https://github.com/callyberz/redux/blob/main/redux-flowchart.png?raw=true)

## Getting started

```sh
npm install
npm run dev
```

## Takeaways

- Redux is a store management library

- In `App.tsx`, we need to have a persistent reference to the store object. Otherwise, the store will be recreated on every state change.

- `compose` is used to chain up multiple functions together for many middleware functions (sideEffects).

### Solutions

- Problem # 1: store is recreated on every state change

1. `useRef` is used to store the store object
2. `useContext` from `StoreProvider`
   2.1 Create a Provider architecture to store the redux store object
   2.2 `useContext` to access the store object in `App.tsx`
   2.3 or create custom hooks, i.e. `useStore`

```ts
// ❌❌❌ this is not working as store is rerendering on every state change
const store = Redux.createStore(reducer);
// this is working as store is not rerendering on every state change
// ✅✅✅ 1. useRef is used to store the store object
const store = useRef(Redux.createStore(reducer)).current;
// 💯💯💯 2. useContext from StoreProvider
const store = useContext(StoreContext);
```

### Subscribe/unsubscribe listeners

- Problem # 2: notify the component when the store is updated

- `store.subscribe(listener)` is used to subscribe listeners to the store.
- When the store is updated (dispatched an action), the listeners array will be called iteratively.
- e.g. `setCount(store.getState().count);` to update the state in the component.
- `store.subscribe(listener)` returns a function to unsubscribe the listener.
- unsubscribe the listener in `useEffect` to avoid memory leaks.

### Middleware

- Problem # 3: perform side effects

- Middleware makes our code intercepting and handling actions before they reach the reducer

- Use cases:

  - Logging
  - Crash reporting
  - Performing asynchronous tasks
  - some side effects

#### Single middleware

- Simply return a custom dispatch/getState function, performing a single side effect task, and then call the original dispatch function.

  ```ts
  dispatch: middleware({
    getState: store.getState,
    dispatch: store.dispatch
  });
  ```

#### Multiple middleware

- We have one more layer to control the dispatch function, by chaining the middleware functions together, and then call the original dispatch function.
- `middlewareAPI` is used to pass the store `getState` and `dispatch` functions to the middleware functions.
- We then chain up all middleware functions, call `compose` to return a single function, and then call the original dispatch function in 1 line of code.

  > Make good use of funcition composition.

Example

```
function foo(x) {
  return x + 1;
}
function bar(y) {
  return y * 2;
}
const result = compose(
  foo,
  bar,
)(1);
```

## References

- [NYTimes Github](https://nytimes.github.io/oak-byo-react-prosemirror-redux/post/build-your-own-redux/)
- [sharpcorner](https://www.c-sharpcorner.com/article/build-your-own-redux-from-scratch/)
- [Redux Official](https://redux.js.org/)

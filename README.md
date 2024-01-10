# Simple Redux from scratch

This is a simple Redux implementation from scratch. It is based on the [Redux Fundamentals](https://redux.js.org/tutorials/fundamentals/part-1-overview) tutorial.

## Getting started

```sh
npm install
npm run dev
```

## Takeaways

- Redux is a store management library,

- In `App.tsx`, we need to have a persistent reference to the store object. Otherwise, the store will be recreated on every state change.

### Solutions

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

- `store.subscribe(listener)` is used to subscribe listeners to the store.
- When the store is updated (dispatched an action), the listeners array will be called iteratively.
- e.g. `setCount(store.getState().count);` to update the state in the component.
- `store.subscribe(listener)` returns a function to unsubscribe the listener.
- unsubscribe the listener in `useEffect` to avoid memory leaks.

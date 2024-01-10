import { useEffect, useState } from 'react';
import './App.css';
import { ActionTypes } from './redux';
import { useStore } from './hooks';

function App() {
  // this is not working as store is rerendering on every state change
  // const store = Redux.createStore(reducer);

  // this is working as store is not rerendering on every state change
  // 1. useRef is used to store the store object
  // const store = useRef(Redux.createStore(reducer)).current;
  // 2. useContext from StoreProvider
  const [store] = useStore();

  const [count, setCount] = useState(store.getState().count);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      console.log('State has changed:', store.getState());
      setCount(store.getState().count);
    });

    // clean up subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [store]);

  return (
    <>
      <div className="card">
        <button onClick={() => store.dispatch({ type: ActionTypes.INCREMENT })}>
          +
        </button>

        <button onClick={() => store.dispatch({ type: ActionTypes.DECREMENT })}>
          -
        </button>

        <div>count is {count}</div>
      </div>
    </>
  );
}

export default App;

import { useContext } from 'react';
import { StoreContext } from './Provider';

export const useStore = () => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('Store is null');
  }

  return [store];
};

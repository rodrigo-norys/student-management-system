import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default function reducers() {
  const persistReducers = persistReducer(
    {
      key: 'API-CONSUME',
      storage,
      whitelist: []
    },
    reducers
  );

  return persistReducers;
}

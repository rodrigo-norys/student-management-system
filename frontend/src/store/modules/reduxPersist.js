import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default function createPersistedReducers(reducers) {
  const persistedReducers = persistReducer(
    {
      key: 'API-CONSUME',
      storage,
      whitelist: [],
    },
    reducers,
  );

  return persistedReducers;
}

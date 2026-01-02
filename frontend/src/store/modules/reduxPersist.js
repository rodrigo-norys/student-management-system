import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

// eslint-disable-next-line
export default reducers => {
  const persistReducers = persistReducer(
    {
      key: 'API-CONSUME',
      storage,
      whitelist: ['auth']
    },
    reducers
  );

  return persistReducers;
}

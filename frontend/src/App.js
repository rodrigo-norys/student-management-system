import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from './store';
import history from './services/history';
import GlobalStyle from './styles/GlobalStyles';
import CustomHistoryRouter from './components/CustomHistory';
import Routes from './routes';

import { validateSessionRequest } from './store/modules/auth/actions';

function App() {
  useEffect(() => {
    store.dispatch(validateSessionRequest());
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CustomHistoryRouter history={history}>
          <Routes />
          <GlobalStyle />
          <ToastContainer autoClose={3000} className={"toast-container"} />
        </CustomHistoryRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;

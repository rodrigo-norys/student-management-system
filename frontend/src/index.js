import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import App from './App';
import store, { persistor } from './store';
import GlobalStyles from './styles/GlobalStyles';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GlobalStyles />
        <App />
        <ToastContainer autoClose={3000} className="toast-container" />
      </PersistGate>
    </Provider>
  </StrictMode>
);

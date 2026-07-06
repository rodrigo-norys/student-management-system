import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import history from './services/history';
import GlobalStyle from './styles/GlobalStyles';
import CustomHistoryRouter from './components/CustomHistory';
import Routes from './routes';

import {
  validateSessionRequest,
  loginFailure,
} from './store/modules/auth/actions';

function App() {
  const dispatch = useDispatch();
  const isLoginPage = window.location.pathname === '/login';

  // Evita o 'GET localhost:3001/tokens/validate 401 (Unauthorized)' para o usuário
  useEffect(() => {
    isLoginPage ? dispatch(loginFailure()) : dispatch(validateSessionRequest());
  }, [isLoginPage, dispatch]);

  return (
    <CustomHistoryRouter history={history}>
      <Routes />
      <GlobalStyle />
      <ToastContainer autoClose={3000} className="toast-container" />
    </CustomHistoryRouter>
  );
}

export default App;

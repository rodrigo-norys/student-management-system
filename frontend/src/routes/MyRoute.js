import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Loading from '../components/Loading';

export default function MyRoute({ children, isClosed = false }) {
  const location = useLocation();

  const {
    isLoggedIn = false,
    isPowerUser = false,
    isCheckingSession = true,
  } = useSelector(state => state.auth || {});

  const isRegisterPath = location.pathname === '/register';

  useEffect(() => {
    if (!isCheckingSession && isLoggedIn && isRegisterPath && !isPowerUser) {
      toast.error('Access Denied. You do not have permission.');
    }
  }, [isLoggedIn, isRegisterPath, isPowerUser, isCheckingSession]);

  if (isCheckingSession) {
    return <Loading isLoading={isCheckingSession} />;
  }

  if (isClosed && !isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ prevPath: location.pathname }}
      />
    );
  }

  if (isLoggedIn && isRegisterPath && !isPowerUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

MyRoute.propTypes = {
  children: PropTypes.node.isRequired,
  isClosed: PropTypes.bool,
};

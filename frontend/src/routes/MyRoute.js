import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function MyRoute({ children, isClosed = false }) {
  const location = useLocation();

  const { isLoggedIn = false, user = {} } = useSelector(state => state.auth || {});

  const isRegisterPath = location.pathname === '/register';
  const hasAdminPower = user?.access_level_id <= 2;

  useEffect(() => {
    if (isLoggedIn && isRegisterPath && !hasAdminPower) {
      toast.error('Access Denied. You do not have permission.');
    }
  }, [isLoggedIn, isRegisterPath, hasAdminPower]);

  if (isClosed && !isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ prevPath: location.pathname }}
      />
    );
  }

  if (isLoggedIn && isRegisterPath && !hasAdminPower) {
    return <Navigate to="/" replace />;
  }

  return children;
}

MyRoute.propTypes = {
  children: PropTypes.node.isRequired,
  isClosed: PropTypes.bool,
};

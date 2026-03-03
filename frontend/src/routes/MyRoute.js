import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function MyRoute({ children, isClosed }) {
  const { isLoggedIn, user, access_level_id } = useSelector(state => state.auth);
  const location = useLocation();

  if (isClosed && !isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          prevPath: location.pathname
        }}
      />
    );
  }

  const isRegisterPath = location.pathname === '/register';
  const isPowerAdmin = !(user || access_level_id <= 2);

  if (isLoggedIn && isRegisterPath && isPowerAdmin) {
    toast.error('Access Denied.');

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

MyRoute.propTypes = {
  children: PropTypes.node.isRequired,
  isClosed: PropTypes.bool,
};

MyRoute.defaultProps = {
  isClosed: false,
};

import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function MyRoute({ children, isClosed }) {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const location = useLocation();
  if (isClosed && !isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ prevPath: location.pathname }}
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

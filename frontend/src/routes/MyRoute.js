import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Loading from 'components/Loading';

export default function MyRoute({ children, isClosed = false }) {
  const location = useLocation();
  const { isLoggedIn = false, isCheckingSession = true } = useSelector(
    (state) => state.auth || {},
  );

  if (isCheckingSession) {
    return <Loading isLoading={isCheckingSession} />;
  }

  if (isClosed && !isLoggedIn) {
    return (
      <Navigate to="/login" replace state={{ prevPath: location.pathname }} />
    );
  }

  return children;
}

MyRoute.propTypes = {
  children: PropTypes.node.isRequired,
  isClosed: PropTypes.bool,
};

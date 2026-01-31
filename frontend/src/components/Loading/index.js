import PropTypes from 'prop-types';
import { Container } from './styled.js';

export default function Loading({ isLoading }) {
  if (!isLoading) return <></>;

  return (
    <Container>
      <div />
    </Container>
  );
}

Loading.defaultProps = {
  isLoading: false,
};

Loading.propTypes = {
  isLoading: PropTypes.bool,
};

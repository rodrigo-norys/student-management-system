import { ErrorMessage } from 'styles/GlobalStyles.js';

const ValidatedTextarea = ({ label, error, ...rest }) => {
  return (
    <label>
      {label}
      <textarea
        {...rest}
        className={error ? 'has-error' : ''}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </label>
  );
};

export default ValidatedTextarea;

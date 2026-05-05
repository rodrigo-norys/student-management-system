import { ErrorMessage } from 'styles/GlobalStyles.js';

const ValidatedInput = ({ label, error, ...rest }) => {
  return (
    <label>
      {label}
      <input
        {...rest}
        className={error ? 'has-error' : ''}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </label>
  );
};

export default ValidatedInput;

import { ErrorMessage } from '../../styles/GlobalStyles.js';

const ValidatedSelect = ({ label, error, array, ...rest }) => {
  return (
    <label>
      {label}
      <select
        {...rest}
        className={error ? 'has-error' : ''}
      >
        <option value=''>Select</option>
        {array.map(item => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </label >
  );
};

export default ValidatedSelect;

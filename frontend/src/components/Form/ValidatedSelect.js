import { ErrorMessage } from 'styles/GlobalStyles.js';

const ValidatedSelect = ({ label, error, array = [], ...rest }) => {
  return (
    <label>
      {label}
      <select
        {...rest}
        className={error ? 'has-error' : ''}
      >
        <option value="" disabled>Select an option</option>
        {array.map((item) => {
          const optionValue = typeof item === 'object' ? item.value : item;
          const optionLabel = typeof item === 'object' ? item.label : item;

          return (
            <option key={String(optionValue)} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </label>
  );
};

export default ValidatedSelect;

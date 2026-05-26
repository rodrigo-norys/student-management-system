import { ErrorMessage } from 'styles/GlobalStyles.js';

// Valida input text de forma dinâmica.
export const ValidatedInput = ({ label, error, ...rest }) => {
  return (
    <label>
      {label}
      <input {...rest} className={error ? 'has-error' : ''} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </label>
  );
};

// Valida select de forma dinâmica.
export const ValidatedSelect = ({ label, error, array = [], ...rest }) => {
  return (
    <label>
      {label}
      <select {...rest} className={error ? 'has-error' : ''}>
        <option value="" disabled>
          Select an option
        </option>
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

// Valida textarea de forma dinâmica.
export const ValidatedTextarea = ({ label, error, ...rest }) => {
  return (
    <label>
      {label}
      <textarea {...rest} className={error ? 'has-error' : ''} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </label>
  );
};

import { useState, useEffect } from 'react';

/**
 * Hook que atrasa a atualização de um valor até que um determinado tempo
 * tenha se passado sem que o valor original sofra alterações.
 */

export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

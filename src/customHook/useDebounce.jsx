import { useEffect, useRef } from 'react';

const useDebounce = (callback, delay) => {
  const timerRef = useRef(null);

  const debouncedCallback = (...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

export default useDebounce;
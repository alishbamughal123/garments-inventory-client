import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// useState-like hook that keeps its value in the URL query string, so list
// state (page, filters, search) survives opening a detail page and pressing Back.
// Default values are omitted from the URL to keep it clean.
const useQueryParamState = (key, defaultValue) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const raw = searchParams.get(key);
  let value = defaultValue;
  if (raw !== null) {
    if (typeof defaultValue === "number") {
      const n = Number(raw);
      value = Number.isFinite(n) && n > 0 ? n : defaultValue;
    } else {
      value = raw;
    }
  }

  const setValue = useCallback(
    (next) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next === defaultValue || next === "" || next == null) {
            params.delete(key);
          } else {
            params.set(key, String(next));
          }
          return params;
        },
        { replace: true }
      );
    },
    [key, defaultValue, setSearchParams]
  );

  return [value, setValue];
};

export default useQueryParamState;

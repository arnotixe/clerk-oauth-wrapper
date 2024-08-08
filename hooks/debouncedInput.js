import { useState } from "react";

const useDebouncedInput = ({
  defaultText = "",
  debounceTime = 750,
  action = null, // callback function
} = {}) => {
  const [text, setText] = useState(defaultText);
  const [t, setT] = useState(null);

  const onChange = (text, immediate = false) => {
    if (t) {
      clearTimeout(t);
    }
    if (immediate) {
      return setText(() => text);
    }
    setT(
      setTimeout(() => {
        setText(() => text); // delayed
        if (action) {
          action(text);
        }
      }, debounceTime),
    );
  };

  return [text, onChange];
};

export default useDebouncedInput;

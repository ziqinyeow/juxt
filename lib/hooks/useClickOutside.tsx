import React from "react";

export const useClickOutside = (callback: Function) => {
  const ref = React.useRef<Element>();

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return ref;
};

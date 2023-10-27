import { useEffect, useState } from "react";

type OS = "win" | "mac" | "unix" | "linux" | null;

const useOperatingSystem = () => {
  const [os, setOs] = useState<OS>(null);

  useEffect(() => {
    if (window.navigator.userAgent.indexOf("Win") !== -1) {
      setOs("win");
    }
    if (window.navigator.userAgent.indexOf("Mac") !== -1) {
      setOs("mac");
    }
    if (window.navigator.userAgent.indexOf("X11") !== -1) {
      setOs("unix");
    }
    if (window.navigator.userAgent.indexOf("Linux") !== -1) {
      setOs("linux");
    }
  }, []);

  return os;
};

export { useOperatingSystem };

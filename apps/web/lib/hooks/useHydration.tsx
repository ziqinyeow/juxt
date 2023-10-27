import { useEffect, useState } from "react";
import { useStore } from "../store";

export const useHydration = () => {
  const { refreshAllFileURLCache } = useStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    refreshAllFileURLCache();
  });

  useEffect(() => {
    // Note: This is just in case you want to take into account manual rehydration.
    // You can remove the following line if you don't need it.
    const unsubHydrate = useStore.persist.onHydrate(() => setHydrated(false));

    const unsubFinishHydration = useStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );

    setHydrated(useStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};

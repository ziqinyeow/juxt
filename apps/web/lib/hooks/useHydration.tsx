import { useEffect, useState } from "react";
import { useStore } from "../store";

export const useHydration = () => {
  const { refreshAllFileURLCache, refreshTracks } = useStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    refreshAllFileURLCache();
  });

  useEffect(() => {
    // Note: This is just in case you want to take into account manual rehydration.
    // You can remove the following line if you don't need it.
    // @ts-ignore
    const unsubHydrate = useStore.persist.onHydrate(() => setHydrated(false));

    // @ts-ignore
    const unsubFinishHydration = useStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );

    // @ts-ignore
    setHydrated(useStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};

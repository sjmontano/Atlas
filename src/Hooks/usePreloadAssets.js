import { useEffect, useState } from "react";

const usePreloadAssets = (srcList = []) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;

    const handleLoad = () => {
      loadedCount++;
      if (loadedCount === srcList.length) setLoaded(true);
    };

    srcList.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleLoad;
      img.onerror = handleLoad;
    });

  }, [srcList]);

  return loaded;
};

export default usePreloadAssets;

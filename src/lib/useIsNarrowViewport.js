import { useEffect, useState } from 'react';

// Tracks a max-width media query so sections can shrink their previews on
// phone-sized screens. Guarded because jsdom's matchMedia is incomplete.
const useIsNarrowViewport = (maxWidth = 640) => {
  const query = `(max-width: ${maxWidth}px)`;
  const [isNarrow, setIsNarrow] = useState(
    () => typeof window.matchMedia === 'function' && window.matchMedia(query).matches
  );

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia(query);
    const onChange = (e) => setIsNarrow(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, [query]);

  return isNarrow;
};

export default useIsNarrowViewport;

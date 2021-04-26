import { useEffect, useState } from 'react';

/**
 * Hook that lets you know when an image has been loaded
 */
export const useImageLoad = (src: string): [HTMLImageElement, boolean] => {
  const [image, setImage] = useState<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    setImage(null);
    setLoaded(false);

    const img = new Image();
    setImage(img);

    img.addEventListener('load', () => {
      setLoaded(true);
    });

    img.src = src;
  }, [src]);

  return [image, loaded];
};
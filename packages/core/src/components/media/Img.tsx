import React, { useCallback, type ImgHTMLAttributes } from 'react';
import { useDelayRender } from '../../hooks/use-delay-render.js';

export function Img(props: ImgHTMLAttributes<HTMLImageElement>) {
  const continueRender = useDelayRender('Img');

  const onLoad = useCallback(() => {
    continueRender();
  }, [continueRender]);

  const onError = useCallback(() => {
    continueRender();
  }, [continueRender]);

  return <img {...props} onLoad={onLoad} onError={onError} />;
}

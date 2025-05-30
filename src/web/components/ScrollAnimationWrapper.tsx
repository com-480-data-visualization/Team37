import React, {useEffect, useRef} from 'react';
import { inView, animate} from 'framer-motion';

export const ScrollAnimationWrapper = ({ children, style = {}, className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      inView(ref.current, (element) => {
        animate(
          element,
          { opacity: [0, 1], x: [-50, 0] },
          {
            duration: 0.9,
            easing: [0.17, 0.55, 0.55, 1],
          }
        );
        
        return () => animate(element, { opacity: 0, x: -50 });
      });
    }
  }, []);

  return (
    <div 
      ref={ref} 
      className={`scroll-section ${className}`} 
      style={{ 
        opacity: 0, 
        position: 'relative',
        width: '100%',
        ...style 
      }}
    >
      {children}
    </div>
  );
};



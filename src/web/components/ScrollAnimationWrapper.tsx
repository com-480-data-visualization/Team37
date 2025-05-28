import React, {useEffect, useRef} from 'react';
import { inView, animate} from 'framer-motion';

/*
export const ScrollAnimationWrapperWithStyle = ({ children, style = {}, className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      // Animate the entire section
      inView(ref.current, () => {
        animate(
          ref.current,
          { opacity: [0, 1], y: [50, 0] },
          { duration: 0.8, easing: [0.17, 0.55, 0.55, 1] }
        );
        
        // Animate child elements with staggered delays
        const elements = ref.current.querySelectorAll('h1, h2, h3, p, .chart-column, .image-text-section');
        elements.forEach((el, i) => {
          animate(
            el,
            { opacity: [0, 1], y: [30, 0] },
            { delay: i * 0.1, duration: 0.6 }
          );
        });
      });
    }
  }, []);

  return (
    <section 
      ref={ref} 
      className={`fullpage-section ${className}`}
      style={{ 
        opacity: 0,
        ...style 
      }}
    >
      {children}
    </section>
  );
};
*/

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
    <div ref={ref} className={`scroll-section ${className}`} style={{ opacity: 0, ...style }}>
      {children}
    </div>
  );
};



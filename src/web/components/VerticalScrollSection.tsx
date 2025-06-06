import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollAnimationWrapper } from './ScrollAnimationWrapper';
import { fullPageStyle } from './FullPageStyle';

export const VerticalScrollSection = ({ title, text, items }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `-${(items.length - 1) * 100}%`]);

  return (
    <div ref={ref} style={{ height: `${items.length * 100}vh`, position: 'relative' }}>
      <ScrollAnimationWrapper style={fullPageStyle}>
        <header>
          <h2 className="scroll-section-header">{title}</h2>
        </header>
        <p className="description-text">{text}</p>
      </ScrollAnimationWrapper>
      <motion.div style={{ y, position: 'sticky', top: 0 }}>
        {items.map((item, index) => (
          <ScrollAnimationWrapper key={`${item.title}-${index}`} style={fullPageStyle}>
            <h2>{item.title}</h2>
            {item.text && item.text !== '' && (
              <p className="description-text">{item.text}</p>
            )}
            {/* {item.text && item.text.trim() !== '' && (
              <p className="description-text">
                {item.text.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            )} */}
            {item.content}
          </ScrollAnimationWrapper>
        ))}
      </motion.div>
    </div>
  );
};

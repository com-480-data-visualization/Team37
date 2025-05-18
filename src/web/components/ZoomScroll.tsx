import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';


export const ZoomScroll = ({ items }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0, 0]);

  return (
    <div ref={ref} style={{ height: `${items.length * 100}vh` }}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            scale,
            opacity,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h2>{item.title}</h2>
          {item.content}
        </motion.div>
      ))}
    </div>
  );
};

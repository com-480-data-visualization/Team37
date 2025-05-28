import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';


export const ZoomScroll = ({ items }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 2]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0, 0]);

  return (
    <div ref={ref} style={{ 
      height: `${items.length * 100}vh`,
      position: 'relative',
      width: '100%'
    }}>
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
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            overflow: 'visible',
            backgroundColor: '#fff',
            padding: '20px'
          }}
        >
          <h2 style={{ 
            marginBottom: '2rem',
            fontSize: '2rem',
            textAlign: 'center',
            maxWidth: '80%',
            color: '#333'
          }}>
            {item.title}
          </h2>
          <div style={{ 
            width: '100%', 
            height: '80vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            position: 'relative',
            overflow: 'visible'
          }}>
            {item.content}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

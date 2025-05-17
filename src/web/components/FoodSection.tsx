import React, {useEffect, useRef} from 'react';
import { motion, useScroll, useTransform, WithQuerySelectorAll, animate, scroll } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { FoodTradeMap } from "./FoodTradeMap";
import placeholder_yemen from '../assets/yemen.png';

export const FoodSection = () => {
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const imgGroupRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !imgGroupRef.current) return;

    const items = imgGroupRef.current.querySelectorAll('.img-container');

    // Animate gallery horizontally during vertical scroll
    scroll(
      animate(imgGroupRef.current, {
        transform: ["none", `translateX(-${items.length - 1}00vw)`],
      }),
      { target: containerRef.current }
    );

    {/*
    // Progress bar representing gallery scroll
    scroll(animate(progressRef.current, { scaleX: [0, 1] }), {
      target: containerRef.current,
    });
    */}
  }, []);

  return (
    <article id="food-gallery">
      <header>
        <h2>Global Food Trade Patterns</h2>
      </header>
      
      <section className="img-group-container" ref={containerRef}>
        <div>
          <ul className="img-group" ref={imgGroupRef}>

            <li className="img-container">
              <div style={{ 
                width: '100%', 
                height: '100%',
                padding: '20px',
                backgroundColor: '#fff'
              }}>
                <FoodTradeMap />
              </div>
              <h3>Global Food Trade Balances</h3>
            </li>

            <li className="img-container">
              <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img 
                  src={placeholder_yemen} 
                  alt="Yemen Food Dependency" 
                  style={{ 
                    maxWidth: '80%', 
                    maxHeight: '80%',
                    objectFit: 'contain',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }} 
                />
              </div>
              <h3>Yemen's Food Import Dependence</h3>
            </li>
            
          </ul>
        </div>
      </section>
      
      {/*<div className="progress" ref={progressRef} /> */}
    </article>
  );
};


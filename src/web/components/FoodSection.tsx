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
          <ul className="img-group" ref={imgGroupRef} style={{
            width: '100vw',
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            margin: 0,
            padding: 0,
            listStyle: 'none',
            boxSizing: 'border-box',
          }}>

            <li className="img-container" style={{
              width: '100vw',
              minHeight: '350px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              overflow: 'visible',
            }}>
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

            <li className="img-container" style={{
              width: '100vw',
              minHeight: '350px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              overflow: 'visible',
            }}>
              <div style={{
                flex: '1 1 300px',
                minWidth: '220px',
                maxWidth: '600px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingRight: '20px',
                boxSizing: 'border-box',
              }}>
                <img 
                  src={placeholder_yemen} 
                  alt="Yemen Food Dependency" 
                  style={{ 
                    width: '100%',
                    height: 'auto',
                    maxHeight: '60vh',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }} 
                />
              </div>
              <div style={{
                flex: '1 1 200px',
                minWidth: '180px',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '20px',
                backgroundColor: 'rgba(255,255,255,0.85)',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                boxSizing: 'border-box',
                overflowY: 'auto',
                maxHeight: '60vh',
              }}>
                <p style={{color: '#333', lineHeight: '1.6', fontSize: '16px'}}>
                In contrast, Yemen's food-related imports are 17.5% of the country's GDP.
                The environment is unsuitable for efficient large-scale
                agriculture which led the country of 39 million people to have
                a high depence on food imports.
                </p>
              </div>
              <h3 style={{marginBottom: '20px', color: '#2c3e50', fontSize: '28px', fontWeight: '600'}}>
                Yemen's Food Import Dependence
              </h3>
            </li>
          </ul>
        </div>
      </section>
      
      {/*<div className="progress" ref={progressRef} /> */}
    </article>
  );
};


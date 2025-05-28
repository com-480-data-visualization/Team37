import React, { useRef, useEffect } from 'react';
import { scroll, animate } from 'framer-motion'; // or wherever your helpers live
import { GlobalMapSlide } from './FoodMapSlide';
import { SaudiGrainTrade } from './SaudiGrainTrade';
import { CountrySlide, CountrySlideProps } from '../CountrySlide';
import placeholder_yemen from '../../assets/yemen.png';
import placeholder_saudi from '../../assets/saudi_water.avif';

export const FoodSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const imgGroupRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imgGroupRef.current) return;
    const items = imgGroupRef.current.querySelectorAll('.img-container');

    // Animate gallery horizontally during vertical scroll
    scroll(
      animate(imgGroupRef.current, {
        transform: ['none', `translateX(-${(items.length - 1) * 100}vw)`],
      }),
      { target: containerRef.current }
    );
  }, []);

  const countryData: CountrySlideProps[] = [
    {
      id: 'yemen',
      title: "Yemen's Food Import Dependence",
      imageSrc: placeholder_yemen,
      imageAlt: 'Yemen Food Dependency',
      description:
        "In contrast, Yemen's food-related imports are 17.5% of the country's GDP. The environment is unsuitable for efficient large-scale agriculture for its 39 million people.",
    },
    {
      id: 'saudi',
      title: "Saudi Arabia's Water Conservation",
      imageSrc: placeholder_saudi,
      imageAlt: 'Saudi Water Conservation',
      description:
        "Description",
      plot: <SaudiGrainTrade />, 
    }
  ];

  return (
    <article id="food-gallery">
      <header>
        <h2>Global Food Trade Patterns</h2>
      </header>

      <section className="img-group-container" ref={containerRef}>
        <div>
          <ul className="img-group" ref={imgGroupRef}>
            <GlobalMapSlide />
            {countryData.map((c) => (
              <CountrySlide key={c.id} {...c} />
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
};

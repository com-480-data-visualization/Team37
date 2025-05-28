import React, { useRef, useEffect } from 'react';
import { scroll, animate } from 'framer-motion'; // or wherever your helpers live
import { GlobalMapSlide } from './FuelMapSlide';
// import { SaudiGrainTrade } from './SaudiGrainTrade';
// import { YemenFoodVsGdp } from './YemenFoodVsGdp';
// import { UkraineGrainExporter } from './UkraineGrainExporter';
import { CountrySlide, CountrySlideProps } from '../CountrySlide';
import placeholder_yemen from '../../assets/yemen.png';
import placeholder_saudi from '../../assets/saudi_water.avif';
import ukraine_img from '../../assets/ukraine.jpg';

export const FuelSection: React.FC = () => {
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
        "PLACEHOLDER: Food Dependence and civil war (shock) - Famine. Plot timeseries of food/GDP. In contrast, Yemen's food-related imports are 17.5% of the country's GDP. The environment is unsuitable for efficient large-scale agriculture for its 39 million people. TODO: Add civil war start event, Make y axis percentage",
    //   plot: <YemenFoodVsGdp />, 

    },
    {
      id: 'saudi',
      title: "Saudi Arabia's Water Conservation",
      imageSrc: placeholder_saudi,
      imageAlt: 'Saudi Water Conservation',
      description:
        "PLACEHOLDER (Trade-offs (water/agriculture) and policy choices): Saudi Arabia's grain story reads like a policy whiplash."+ 
        "Flush with oil money, the kingdom used fossil-aquifer irrigation to become a net" +
        "wheat exporter in the 1980s-90s. Then, on 19 November 2007, Riyadh ordered production" +
        "quotas cut each year until domestic procurement stopped—mission accomplished with the last local wheat purchase in 2015/16, turning the country into a four-million-ton-a-year importer. A broader water crackdown followed: green-fodder crops were banned in December 2015, the prohibition taking full effect on 5 November 2018. That same day, the government eased up slightly, offering small farmers subsidised contracts for up to 1.5 million tons of wheat a year. By 2023/24 the revival had lifted output to about 1.2 million tons, but Saudi grain needs still hinge on world markets—and on whichever policy pivot comes next.",
    //   plot: <SaudiGrainTrade />, 
    },
    {
      id: 'ukraine',
      title: "Ukraine the Bread Basket",
      imageSrc: ukraine_img,
      imageAlt: 'Ukraine Fields',
      description:
        "PLACEHOLDER (Bread Basket and War): TODO: why is y axis broken? Fix events, fix seeing value when hovering",
    //   plot: <UkraineGrainExporter />, 
    }
  ];

  return (
    <article id="fuel-gallery">
      <header>
        <h2>Global Food Trade Patterns</h2>
      </header>

      <section className="img-group-container" ref={containerRef}>
        <div>
          <ul className="img-group" ref={imgGroupRef}>
            {countryData.map((c) => (
              <CountrySlide key={c.id} {...c} />
            ))}
            <GlobalMapSlide />
          </ul>
        </div>
      </section>
    </article>
  );
};

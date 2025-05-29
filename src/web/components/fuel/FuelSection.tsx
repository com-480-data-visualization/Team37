import React, { useRef, useEffect } from 'react';
import { scroll, animate } from 'framer-motion'; // or wherever your helpers live
import { GlobalMapSlide } from './FuelMapSlide';
import { ChinaFuelTrade } from './ChinaFuelTrade';
import { ChinaFuelSources } from './ChinaFuelSources';
import { UsaFuelTrade } from './UsaFuelTrade';
import { CountrySlideBTF, CountrySlidePropsBTF } from '../CountrySlideBTF';
import { CountrySlideBTFF, CountrySlidePropsBTFF } from '../CountrySlideBTFF';
import usa_banner from '../../assets/usa_oil.png';
import china_banner from '../../assets/china.png';

type SlideBTF = CountrySlidePropsBTF & { kind: 'BTF' }
type SlideBTFF = CountrySlidePropsBTFF & { kind: 'BTFF' }

type SlideData = SlideBTF | SlideBTFF

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

  const countryData: SlideData[] = [
    {
      kind: 'BTF',
      id: 'usa',
      title: "USA's Energy Independence",
      imageSrc: usa_banner,
      imageAlt: 'USA Oil Barrel',
      description:
        "PLACEHOLDER: The united states became energy independent thanks to the shale revolution. Key events..",
      plot: <UsaFuelTrade />,

    },
    {
      kind: 'BTFF',
      id: 'china',
      title: "China Manufacturing",
      imageSrc: china_banner,
      imageAlt: 'Saudi Water Conservation',
      description:
        "PLACEHOLDER (Energy imports for manufacturing/diversification): Saudi Arabia's grain story reads like a policy whiplash." +
        "Flush with oil money, the kingdom used fossil-aquifer irrigation to become a net" +
        "wheat exporter in the 1980s-90s. Then, on 19 November 2007, Riyadh ordered production" +
        "quotas cut each year until domestic procurement stopped—mission accomplished with the last local wheat purchase in 2015/16, turning the country into a four-million-ton-a-year importer. A broader water crackdown followed: green-fodder crops were banned in December 2015, the prohibition taking full effect on 5 November 2018. That same day, the government eased up slightly, offering small farmers subsidised contracts for up to 1.5 million tons of wheat a year. By 2023/24 the revival had lifted output to about 1.2 million tons, but Saudi grain needs still hinge on world markets—and on whichever policy pivot comes next.",
      plot1: <ChinaFuelTrade />,
      plot2: <ChinaFuelSources />,
    },
  ];

  return (
    <article id="fuel-gallery">
      <header>
        <h2>Global Food Trade Patterns</h2>
      </header>

      <section className="img-group-container" ref={containerRef}>
        <div>
          <ul className="img-group" ref={imgGroupRef}>
            {countryData.map((slide) => {
              if (slide.kind === 'BTF') {
                return <CountrySlideBTF key={slide.id} {...slide} />
              } else {
                return <CountrySlideBTFF key={slide.id} {...slide} />
              }
            })}
            <GlobalMapSlide />
          </ul>
        </div>
      </section>
    </article>
  );
};

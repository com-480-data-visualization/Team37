import React from 'react';
import { WorldTradeMap } from "./components/WorldTradeMap";
import { TradeTrendChart } from "./components/TradeTrendChart";
import { TradeGDPChart } from "./components/TradeGDPChart";
import { TradeWeightChart } from "./components/TradeWeightChart";
import { TradeBalanceDistribution } from "./components/TradeBalanceDistribution";
import { WorldTradeMapAnimated } from "./components/WorldTradeMapAnimated";
import { ChapterTotalsBarChart } from "./components/ChapterTotalsBarChart";
import { FoodSection } from './components/food/FoodSection';
import { FuelSection } from './components/fuel/FuelSection';
import { ScrollAnimationWrapper } from './components/ScrollAnimationWrapper'
import { VerticalScrollSection } from './components/VerticalScrollSection';
import { fullPageStyle } from './components/FullPageStyle';
import { ZoomScroll } from './components/ZoomScroll'

import { useEffect, useRef } from 'react';
import { inView, animate } from 'framer-motion';
import { FoodTradeMap } from "./components/food/FoodTradeMap";
import { FuelTradeMap } from "./components/fuel/FuelTradeMap";

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = React.useState<string>('');
  const [selectedYear, setSelectedYear] = React.useState<string>('2023');
  const [selectedProduct, setSelectedProduct] = React.useState<string>('84');

  const handleCountryClick = (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  return (
    <div className="app">
      <ScrollAnimationWrapper style={fullPageStyle}>
        <section className="intro">
          <header>
            <h1>The Flow of Goods Around the World</h1>
            <p className="description-text">In 2025, the collective brain of humanity turned its attention to the difference between where goods like food and cars are <u>made</u> and where they are <u>consumed</u>.
              Motivated by the desire to reduce transportation emissions or by national security concerns, humanity appears to be peeking under the hood of the global trade system, with the subject debated everywhere from government circles to taxi rides.
              <br />
              <br />
              This website attempts to provide intuition on the ever-more important matter of how goods flow around the world.
            </p>
          </header>
        </section>
      </ScrollAnimationWrapper>
      <main>

        <VerticalScrollSection title="The Basics" text={
          <>
            It is said that the world became more and more interconnected over the last 35 years.
            <br />
            Let's get a sense of what changed by asking:
          </>} items={[
            { title: "What percentage of global economic activity is conducted through trade?", content: <TradeGDPChart /> },
            {
              title: "In order to observe trade trends through a more \"material\" metric, let's answer:", text: (
                <>
                  <i>How many tons of products does humanity shuffle around the world each year?</i>
                  <br />
                  <br />
                  It turns out that at 15 Billion Metric Tons per year, humanity is shipping the equivalent weight of all 1.2 Billion active cars in the world <b><i>7 times over!</i></b>
                </>
              ), content: <TradeWeightChart />
            }
          ]} />
        {/* Moving 15 Billion metric tonnes per year is equivalent to shipping all 1.2 Billion active cars in the world <i>7 times!</i>. */}
        {/* <ScrollAnimationWrapper style={fullPageStyle}>
          <section className="image-text-section">
            <div className="text-column">
              <p className="description-text">
                Moving 15 Billion metric tonnes per year is equivalent to shipping all 1.2 Billion active cars in the world <i>7 times!</i>.
                <br />
                <br />
                (Placeholder Figure)
              </p>
            </div>
          </section>
        </ScrollAnimationWrapper> */}

        <ScrollAnimationWrapper style={fullPageStyle}>
          <section style={{ width: '100%', height: '100%', display: 'flex', aspectRatio: '16/9', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
            <p className="description-text">
              In Dollar terms, some countries consume more material goods than they create. Others produce the differrence but do not consume it themselves.
              <br />
              Others produce the differrence but do not consume it themselves.
              <br />
              <br />
              The following map shows the absolute dollar value of the trade balance of each country.
              <br />
              <br />
            </p>
              <WorldTradeMap onCountryClick={handleCountryClick} />
          </section>
        </ScrollAnimationWrapper>

        {/* Sankey */}
        {selectedCountry && (
          <CountrySankey countryCode={selectedCountry} year={selectedYear} productChapter={selectedProduct} />
        )}

        <ScrollAnimationWrapper style={fullPageStyle}>
          <section>
            <h2> Which Categories of Goods are more Prominent in Global Trade Value? (2023)</h2>
            <p className="description-text">
              While Mineral fuels dominate trade by sheer weight, electronics, machinery, and vehicles represent a larger share of the total dollar value exchanged globally.
            </p>
            <ChapterTotalsBarChart />
          </section>
        </ScrollAnimationWrapper>

        <FoodSection />
        <FuelSection />

        <ScrollAnimationWrapper style={fullPageStyle}>
          <section>
            <p className="description-text"> Freely explore trade dynamics for any country across 87 categories of goods for years between 1995 and 2023!
            </p>
            <WorldTradeMapAnimated />
          </section>
        </ScrollAnimationWrapper>
      </main>
    </div>
  );
};

export default App;
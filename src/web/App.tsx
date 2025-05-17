import React from 'react';
import { WorldTradeMap } from "./components/WorldTradeMap";
import { TradeTrendChart } from "./components/TradeTrendChart";
import { TradeGDPChart } from "./components/TradeGDPChart";
import { TradeWeightChart } from "./components/TradeWeightChart";
import { TradeBalanceDistribution } from "./components/TradeBalanceDistribution";
import { WorldTradeMapAnimated } from "./components/WorldTradeMapAnimated";
import { ChapterTotalsBarChart } from "./components/ChapterTotalsBarChart";
import { FoodSection } from './components/FoodSection';
import {ScrollAnimationWrapper} from './components/ScrollAnimationWrapper'
import { VerticalScrollSection } from './components/VerticalScrollSection';
import { fullPageStyle } from './components/FullPageStyle';

import {useEffect, useRef} from 'react';
import { inView, animate} from 'framer-motion';
import { FoodTradeMap } from "./components/FoodTradeMap";

/* TODO: TMP */
import placeholder_cars from './assets/tmp_cars_world.png';

const App: React.FC = () => {
  return (
    <div className="app">
        <ScrollAnimationWrapper style={fullPageStyle}>
        <section className="intro">
          <header>
            <h1>The Flow of Goods Around the World</h1>
            <h2>(Work in progress)</h2>
            <p className="description-text">In 2025, the collective brain of humanity turned its attention to the difference between where goods like food and cars are <i>made</i> and where they are <i>consumed</i>.
              Motivated by the desire to reduce transportation emissions or by national security concerns, humanity appears to be peeking under the hood of the global trade system, with the subject debated everywhere from government circles to taxi rides.
              <br />
              <br />
              This page attempts to provide intuition on the ever-more important matter of how goods flow around the world.
            </p>
          </header>
        </section>
        </ScrollAnimationWrapper>
      <main>

        <VerticalScrollSection items={[
          { title: "What percentage of global economic activity is conducted through trade?", content: <TradeGDPChart /> },
          { title: "How much \"stuff\" does humanity shuffle around the world?", content: <TradeWeightChart/> }
        ]} />

        <ScrollAnimationWrapper style={fullPageStyle}>
        <section className="image-text-section"> {/* Container for the row */}
          <div className="image-column"> {/* Left column for image */}
            <img
              src={placeholder_cars}
              alt="Descriptive text"
              className="section-image" // Class for specific image styling
            />
          </div>
          <div className="text-column"> {/* Right column for text */}
            {/* <h2>Title</h2> */}
            <p className="description-text">
              Moving 15 Billion metric tonnes per year is equivalent to shipping all 1.2 Billion active cars in the world <i>7 times!</i>.
              <br />
              <br />
              (Placeholder Figure)

            </p>

          </div>
        </section>
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper style={fullPageStyle}>
        <section>
          <p className="description-text"> In Dollar terms, some countries consume more material
            goods than they create.
            <br />
            <br />

            Others produce the differrence but do not consume it themselves.
          </p>
          <WorldTradeMap />
        </section>
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper style={fullPageStyle}>
        <section>
          <h2>What Categories of Goods Dominate Global Trade Value? (2023)</h2>
          <p className="description-text">
            While fuels dominate trade by sheer weight, electronics, machinery, and vehicles represent a larger share of the total dollar value exchanged globally.
          </p>
          <ChapterTotalsBarChart />
        </section>
        </ScrollAnimationWrapper>

        {/* <section>
          <h2>Trade Balance Distribution</h2>
          <TradeBalanceDistribution />
        </section> */}

        {/*<section>
          <h1>  FOOD </h1>
          <p className="description-text"> 
          </p>
          <FoodTradeMap />
        </section> */}

        <FoodSection />

        {/* <section>
          <h2>Trade Balance Trends</h2>
          <TradeTrendChart />
        </section> */}

        <ScrollAnimationWrapper style={fullPageStyle}>
        <section>
          <p className="description-text"> Freely explore the location of deficits and surpluces for
            specific goods categories for any year after 1995.
          </p>
          {/* <h2>World Trade Balance Map (Animated)</h2> */}
          <WorldTradeMapAnimated />
        </section>
        </ScrollAnimationWrapper>
      </main>
    </div>
  );
};

export default App;
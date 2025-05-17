import React from 'react';
import { WorldTradeMap } from "./components/WorldTradeMap";
import { FoodTradeMap } from "./components/FoodTradeMap";
import { TradeTrendChart } from "./components/TradeTrendChart";
import { TradeGDPChart } from "./components/TradeGDPChart";
import { TradeWeightChart } from "./components/TradeWeightChart";
import { TradeBalanceDistribution } from "./components/TradeBalanceDistribution";
import { WorldTradeMapAnimated } from "./components/WorldTradeMapAnimated";
import { ChapterTotalsBarChart } from "./components/ChapterTotalsBarChart";
import { Parallax } from 'react-scroll-parallax';
import { ParallaxProvider } from 'react-scroll-parallax';
import { ParallaxBanner, ParallaxBannerLayer } from 'react-scroll-parallax';


/* TODO: TMP */
import placeholder_cars from './assets/tmp_cars_world.png';
import placeholder_yemen from './assets/yemen.png';

const App: React.FC = () => {
  return (
    <ParallaxProvider>
    <div className="app">
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
      <main>

        {/* Wrap the two charts in a flex container */}
        <div className="chart-row">
          <section className="chart-column">
            <h2>What percentage of global economic activity is conducted through trade?</h2>
            <TradeGDPChart />
          </section>
          <section className="chart-column">
            <h2>How much "stuff" does humanity shuffle around the world? </h2>
            <TradeWeightChart />
          </section>
        </div>
        {/* End of the flex container */}

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

        <section>
          <p className="description-text"> In Dollar terms, some countries consume more material
            goods than they create.
            <br />
            <br />

            Others produce the differrence but do not consume it themselves.
          </p>
          <WorldTradeMap />
        </section>

        <section>
          <h2>What Categories of Goods Dominate Global Trade Value? (2023)</h2>
          <p className="description-text">
            While fuels dominate trade by sheer weight, electronics, machinery, and vehicles represent a larger share of the total dollar value exchanged globally.
          </p>
          <ChapterTotalsBarChart />
        </section>

        {/* <section>
          <h2>Trade Balance Distribution</h2>
          <TradeBalanceDistribution />
        </section> */}

        <section>
          <h1>  FOOD </h1>
          <p className="description-text"> 
          </p>
          <FoodTradeMap />
        </section>

        <section className="image-text-section"> {/* Container for the row */}
            <ParallaxBanner style={{ aspectRatio: '2/1', margin: '2rem 0' }}>
              <ParallaxBannerLayer speed={-15}>
                {/*<div className="image-column"> {/* Left column for image } */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden'
                  }}>
                  <img
                    src={placeholder_yemen}
                    alt="Descriptive text"
                    className="section-image" // Class for specific image styling
                  />
                </div>
              </ParallaxBannerLayer>
              <ParallaxBannerLayer speed={5}>
                {/* <h2>Title</h2> */}
                  <div style={{
                    padding: '2rem',
                    color: 'white', // White text
                    maxWidth: '100%',
                    position: 'relative',
                    zIndex: 2 // Ensure text stays above overlay
                  }}>
                <p className="description-text" style={{ color: 'inherit' }}>
                  {/* @yq: text belong to the previous section. comment out for now.
                  In dollar terms, Brazil produces a surplus of food-related goods that is similar to China's deficit.
                  Even though this is the largest food-related trade defficit in the world, it is still only approximately 0.6% of China's total GDP.

                  <br />
                  <br /> */}
                  {/* @yq: the yemen text should be much more concise. We're doing presentation, not a full blown paper */}
                  In contrast, Yemen's food-related imports are 17.5% of the country's GDP.
                  <br />
                  The environment is unsuitable for efficient large-scale agriculture which led the country of 39 million people to have a high depence on food imports.
                  {/* (Placeholder Figure) */}
                </p>
              </div>
            </ParallaxBannerLayer>
            </ParallaxBanner>
          </section>



        {/* <section>
          <h2>Trade Balance Trends</h2>
          <TradeTrendChart />
        </section> */}

        <section>
          <p className="description-text"> Freely explore the location of deficits and surpluces for
            specific goods categories for any year after 1995.
          </p>
          {/* <h2>World Trade Balance Map (Animated)</h2> */}
          <WorldTradeMapAnimated />
        </section>
      </main>
    </div>
    </ParallaxProvider>
  );
};

export default App;
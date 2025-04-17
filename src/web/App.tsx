import React from 'react';
import { WorldTradeMap } from "./components/WorldTradeMap";
import { TradeTrendChart } from "./components/TradeTrendChart";
import { TradeGDPChart } from "./components/TradeGDPChart";
import { TradeWeightChart } from "./components/TradeWeightChart";
import { TradeBalanceDistribution } from "./components/TradeBalanceDistribution";
import { WorldTradeMapAnimated } from "./components/WorldTradeMapAnimated";

const App: React.FC = () => {
  return (
    <div className="app">
      <header>
        <h1>The Flow of Goods Around the World</h1>
        {/* <p>Visualization Analysis Based on Real Trade Data</p> */}
      </header>
      <main>

        {/* Wrap the two charts in a flex container */}
        <div className="chart-row">
          <section className="chart-column">
            <h2>Trade as Percentage of GDP</h2>
            <TradeGDPChart />
          </section>
          <section className="chart-column">
            <h2>Global Trade by Weight</h2>
            <TradeWeightChart />
          </section>
        </div>
        {/* End of the flex container */}

        <section>
          <WorldTradeMap />
        </section>
        <section>
          <h2>Trade Balance Distribution</h2>
          <TradeBalanceDistribution />
        </section>



        <section>
          <h2>Trade Balance Trends</h2>
          <TradeTrendChart />
        </section>
        <section>
          <h2>World Trade Balance Map (Animated)</h2>
          <WorldTradeMapAnimated />
        </section>
      </main>
    </div>
  );
};

export default App;
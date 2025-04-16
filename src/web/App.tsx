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
        <h1>World Trade Visualization</h1>
        <p>Visualization Analysis Based on Real Trade Data</p>
      </header>
      <main>
        <section>
          <h2>World Trade Balance Map (Animated)</h2>
          <WorldTradeMapAnimated /> 
        </section>
        <section>
          <h2>Global Trade Balance Map (2023)</h2>
          <WorldTradeMap />
        </section>
        <section>
          <h2>Trade Balance Distribution</h2>
          <TradeBalanceDistribution />
        </section>
        <section>
          <h2>Trade as Percentage of GDP</h2>
          <TradeGDPChart />
        </section>
        <section>
          <h2>Global Trade by Weight</h2>
          <TradeWeightChart />
        </section>
        <section>
          <h2>Trade Balance Trends</h2>
          <TradeTrendChart />
        </section>
      </main>
    </div>
  );
};

export default App; 
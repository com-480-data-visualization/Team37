import React from 'react';
import { WorldTradeMap } from "./components/WorldTradeMap";
import { TradeTrendChart } from "./components/TradeTrendChart";

const App: React.FC = () => {
  return (
    <div className="app">
      <header>
        <h1>World Trade Visualization</h1>
        <p>Visualization Analysis Based on Real Trade Data</p>
      </header>
      <main>
        <section>
          <WorldTradeMap />
        </section>
        <section>
          <TradeTrendChart />
        </section>
      </main>
    </div>
  );
};

export default App; 
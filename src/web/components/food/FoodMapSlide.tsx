import React from 'react';
import { FoodTradeMap } from './FoodTradeMap';

export const GlobalMapSlide: React.FC = () => (
  <li className="img-container">
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '20px',
        backgroundColor: '#fff',
      }}
    >
      <FoodTradeMap />
    </div>
    <h3>Global Food Trade Balances</h3>
  </li>
);

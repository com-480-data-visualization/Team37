import React from 'react';
import { FuelTradeMap } from './FuelTradeMap';

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
      <FuelTradeMap />
    </div>
    <h3>Global Fuel Trade Balances</h3>
  </li>
);

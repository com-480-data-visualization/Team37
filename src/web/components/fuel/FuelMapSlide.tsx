import React from 'react';
import { FuelTradeMap } from './FuelTradeMap';

export const GlobalMapSlide: React.FC = () => (
  <li
    className="img-container"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px', // Inset the content box from slide edges
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        width: '100%', // Fill padded area of li
        height: '100%', // Fill padded area of li
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px', // Padding inside the white box
        boxSizing: 'border-box',
      }}
    >
      <h2 style={{
        textAlign: 'center',
        margin: '0 0 20px 0', // Space below title
        color: '#333',
        fontSize: '24px',
        flexShrink: 0, // Prevent title from shrinking
      }}>
        Global Mineral Fuel Trade Balances (2023)
      </h2>
      <div style={{ flexGrow: 1, position: 'relative' }}> {/* Map container takes remaining space */}
        <FuelTradeMap />
      </div>
    </div>
  </li>
);

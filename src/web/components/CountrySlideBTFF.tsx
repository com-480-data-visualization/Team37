import React from 'react';

export interface CountrySlidePropsBTFF {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  plot1?: React.ReactNode;      // first chart slot
  plot2?: React.ReactNode;      // second chart slot
}

export const CountrySlideBTFF: React.FC<CountrySlidePropsBTFF> = ({
  id,
  title,
  imageSrc,
  imageAlt,
  description,
  plot1,
  plot2,
}) => (
  <li
    className="img-container"
    id={id}
    style={{
      width: '100vw',
      height: '100vh',
    }}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '25% 75%',
        gridTemplateRows: 'auto 60%',
        width: '100%',
        height: '100%',
        rowGap: '20px', // Added gap between rows
      }}
    >
      {/* image spans both rows on the left */}
      <div
        style={{
          gridColumn: '1 / 2',
          gridRow: '1 / 3',
          padding: '20px',
        }}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        />
      </div>

      {/* text description in top-right */}
      <div
        style={{
          gridColumn: '2 / 3',
          gridRow: '1 / 2',
          padding: '30px',
          backgroundColor: 'rgba(255,255,255,0.85)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          borderRadius: '8px',
          marginTop: '20px', // Push the text box down
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <h3 style={{ 
          margin: 0, 
          marginBottom: '10px', 
          color: '#2c3e50', 
          fontSize: '28px', 
          fontWeight: 600 
        }}>
          {title}
        </h3>

        {/* Then description */}
        <p style={{
          whiteSpace: 'pre-line',
          color: '#333',
          lineHeight: 1.6,
          fontSize: '16px',
          paddingLeft: '5%', // Add padding on the left
          paddingRight: '10%' // Add padding on the right
        }}>
          {description}
        </p>
      </div>

      {/* two plots side-by-side at bottom-right */}
      <div
        style={{
          gridColumn: '2 / 3',
          gridRow: '2 / 3',
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          // justifyItems: 'center',   // ← center horizontally
          // alignItems: 'center',     // ← center vertically
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: '8px',
          marginBottom: '20px', // Pull the plots container box up
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        {plot1 && (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {plot1}
          </div>
        )}
        {plot2 && (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {plot2}
          </div>
        )}
      </div>
    </div>
  </li>
);

import React from 'react';

export interface CountrySlidePropsBTF {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  plot?: React.ReactNode;      // ← optional slot for any chart
}

export const CountrySlideBTF: React.FC<CountrySlidePropsBTF> = ({
  id, title, imageSrc, imageAlt, description, plot,
}) => (
  <li
    className="img-container"
    id={id}
    style={{                      // make sure the LI fills the full viewport
      width: '100vw',
      height: '100vh',
    }}
  >
    {/* 2 columns (30% / 70%), 2 rows (auto / 25%) */}
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
      {/* full-height image on left spanning both rows */}
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

      {/* optional plot in bottom-right */}
      {plot && (
        <div
          style={{
            gridColumn: '2 / 3',
            gridRow: '2 / 3',
            padding: '20px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            display: 'flex',        // Make it a flex container
            alignItems: 'center',   // Center vertically
            justifyContent: 'center', // Center horizontally
            borderRadius: '8px',
            marginBottom: '20px', // Pull the plot box up
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          {plot}
        </div>
      )}
    </div>
  </li>
);

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
        gridTemplateColumns: '30% 70%',
        gridTemplateRows: 'auto 1fr',
        width: '100%',
        height: '100%',
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

      {/* text description at top-right */}
      <div
        style={{
          gridColumn: '2 / 3',
          gridRow: '1 / 2',
          padding: '30px',
          backgroundColor: 'rgba(255,255,255,0.85)',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <p style={{ color: '#333', lineHeight: 1.6, fontSize: '16px' }}>
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
          gap: '20px',
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        {plot1 && <div style={{ width: '100%', height: '100%' }}>{plot1}</div>}
        {plot2 && <div style={{ width: '100%', height: '100%' }}>{plot2}</div>}
      </div>
    </div>

    {/* slide title */}
    <h3
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        margin: 0,
        color: '#2c3e50',
        fontSize: '28px',
        fontWeight: 600,
      }}
    >
      {title}
    </h3>
  </li>
);

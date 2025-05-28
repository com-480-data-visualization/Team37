import React from 'react';

export interface CountrySlideProps {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  plot?: React.ReactNode;      // ← optional slot for any chart
}

export const CountrySlide: React.FC<CountrySlideProps> = ({
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
        gridTemplateColumns: '30% 70%',
        gridTemplateRows: 'auto 60%',
        width: '100%',
        height: '100%',
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
          alignItems: 'center',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <p style={{ color: '#333', lineHeight: 1.6, fontSize: '16px' }}>
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
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          {plot}
        </div>
      )}
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

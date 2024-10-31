import React from 'react';

// info-item.tsx
interface InfoItemProps {
    label: string;
    value: string | number | undefined;
  }
  
  export default function InfoItem({ label, value }: InfoItemProps) {
    return (
      <p>
        <strong>{label}</strong> {value ?? 'No especificado'}
      </p>
    );
  }
  
import React, { ReactNode } from 'react';

interface InfoSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, description, children }) => {
  return (
    <div className="p-4 shadow-sm mb-4 bg-white rounded-lg">
      <div className="mb-3">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-500">{description}</p>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

export default InfoSection;

import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Loader, CheckCircle } from 'lucide-react';

const ItemType = 'razonSocial';

interface SocialReasonItemProps {
  socialReason: string | undefined; // Acepta string o undefined
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  companyType?: string;
  isVerifying: boolean;
}


const SocialReasonItem: React.FC<SocialReasonItemProps> = ({ socialReason, index, moveItem, companyType, isVerifying }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => {
        if (node) drag(drop(node));
      }}
      className={`flex flex-col items-center justify-center rounded-md shadow-sm w-full min-w-[150px] md:min-w-[200px] h-[50px] transition-transform ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center justify-center w-full">
        <p className="text-sm text-center">{`opción ${index + 1}`}</p>
        {isVerifying ? (
          <Loader className="w-4 h-4 ml-2 text-sky-300 animate-spin" style={{ animationDuration: "2s" }} />
        ) : (
          <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
        )}
      </div><p className="text-lg font-semibold text-center">
        {socialReason ? `${socialReason} ${companyType}` : 'N/A'}
      </p>
    </div>
  );
};

export default SocialReasonItem;

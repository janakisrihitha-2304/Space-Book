import React from 'react';
import { Undo } from 'lucide-react';
import { useApp } from '../Context/AppContext';

const UndoBanner = () => {
  const { undoAction, undoCancel, currentTheme } = useApp();
  if (!undoAction) return null;

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 ${currentTheme.card} ${currentTheme.border} border px-6 py-3 rounded-lg shadow-xl flex items-center gap-4`}>
      <span className={currentTheme.text}>Booking cancelled. Restore?</span>
      <button 
        onClick={undoCancel}
        className={`${currentTheme.primary} text-white px-4 py-1 rounded-md text-sm font-medium flex items-center gap-2`}
      >
        <Undo className="w-4 h-4" />
        Undo
      </button>
    </div>
  );
};

export default UndoBanner;

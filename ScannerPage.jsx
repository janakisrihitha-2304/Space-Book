import React from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../Components/QRScanner';

const ScannerPage = () => {
  const navigate = useNavigate();

  const handleScan = (data) => {
    console.log('Scanned:', data);
    alert(`Check-in: ${data.bookingId || 'Unknown'}`);
  };

  return (
    <QRScanner 
      onScan={handleScan} 
      onClose={() => navigate('/bookings')} 
    />
  );
};

export default ScannerPage;
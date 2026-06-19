import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download } from 'lucide-react';
import { useApp } from '../Context/AppContext';

const QRDisplay = ({ booking, onClose }) => {
  const { currentTheme } = useApp();

  // Safe base64 for Unicode strings
  const safeBtoa = (str) => {
    try {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        (match, p1) => String.fromCharCode('0x' + p1)));
    } catch (e) {
      return 'fallback';
    }
  };

  const qrData = React.useMemo(() => {
    if (!booking?.id || !booking?.userId || !booking?.resourceId) {
      return JSON.stringify({ error: 'Invalid booking data' });
    }
    return JSON.stringify({
      bookingId: booking.id,
      userId: booking.userId,
      resourceId: booking.resourceId,
      title: booking.title || 'Untitled',
      timestamp: new Date().toISOString(),
      checksum: safeBtoa(`${booking.id}:${booking.userId}:${booking.resourceId}`).slice(0, 8)
    });
  }, [booking]);

  const handleDownload = () => {
    try {
      const svg = document.getElementById('booking-qr-code');
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = `booking-${booking?.id || 'unknown'}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!booking) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <p className="text-center text-red-500">No booking data available</p>
          <button onClick={onClose} className="mt-4 w-full py-2 rounded-xl bg-gray-200">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${currentTheme.card} rounded-3xl shadow-2xl p-8 max-w-md w-full animate-fade-in`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${currentTheme.text}`}>Your Check-In QR</h3>
          <button onClick={onClose} className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all ${currentTheme.text}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="p-4 bg-white rounded-2xl shadow-inner">
            <QRCodeSVG
              id="booking-qr-code"
              value={qrData}
              size={220}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          <div className="text-center">
            <p className={`font-semibold ${currentTheme.text} text-lg`}>{booking.title || 'Untitled Booking'}</p>
            <p className={`text-sm ${currentTheme.textSecondary}`}>{booking.resourceName || 'Resource'}</p>
            <p className={`text-xs ${currentTheme.textSecondary} mt-2`}>Scan at the resource location to check in</p>
            <p className={`text-xs font-mono mt-1 ${currentTheme.textSecondary} opacity-60`}>ID: {booking.id}</p>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={handleDownload}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl ${currentTheme.primary} text-white font-medium hover:opacity-90 transition-all`}
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className={`flex-1 py-3 rounded-xl ${currentTheme.secondary} ${currentTheme.text} font-medium hover:opacity-90 transition-all`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRDisplay;
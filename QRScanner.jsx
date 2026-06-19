import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Camera, ScanLine, Keyboard } from 'lucide-react';
import { useApp } from '../Context/AppContext';

const QRScanner = ({ onScan, onClose }) => {
  const { currentTheme } = useApp();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [showManual, setShowManual] = useState(false);
  const scanningRef = useRef(false); // Use ref instead of state for scan loop

  useEffect(() => {
    let mounted = true;
    let stream = null;

    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        if (!mounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          scanningRef.current = true;
          setCameraError(null);
          scanLoop();
        }
      } catch (err) {
        if (mounted) {
          setCameraError(
            err.name === 'NotAllowedError' 
              ? 'Camera permission denied. Use manual entry.'
              : 'Camera not available. Use manual entry.'
          );
        }
      }
    };

    initCamera();
    
    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      scanningRef.current = false;
    };
  }, []);

  const scanLoop = useCallback(() => {
    if (!scanningRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      requestAnimationFrame(scanLoop);
      return;
    }

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    detectQR(canvas, ctx);
    requestAnimationFrame(scanLoop);
  }, []);

  const detectQR = async (canvas, ctx) => {
    try {
      // jsqr is CommonJS, handle both import styles
      const jsqrModule = await import('jsqr');
      const jsqr = jsqrModule.default || jsqrModule;
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsqr(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        scanningRef.current = false;
        try {
          const data = JSON.parse(code.data);
          onScan(data);
        } catch (e) {
          onScan({ bookingId: code.data.trim() });
        }
      }
    } catch (err) {
      // No QR found or jsqr error — continue scanning
    }
  };

  const handleManualSubmit = () => {
    if (!manualCode.trim()) return;
    try {
      const data = JSON.parse(manualCode.trim());
      onScan(data);
    } catch (e) {
      onScan({ bookingId: manualCode.trim() });
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm z-10">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <ScanLine className="w-5 h-5" />
          Scan Check-In QR
        </h3>
        <button onClick={onClose} className="p-2 text-white hover:bg-white/20 rounded-lg">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Scan overlay */}
        <div className="relative w-64 h-64 z-10">
          <div className="absolute inset-0 border-2 border-white/30 rounded-3xl" />
          <div className="absolute inset-0 border-2 border-green-400/50 rounded-3xl animate-pulse" />
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg" />
          
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl">
              <Camera className="w-12 h-12 text-white/50" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="bg-gray-900 p-6 rounded-t-3xl space-y-4 z-10">
        {cameraError && (
          <div className="p-3 bg-red-100/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
            {cameraError}
          </div>
        )}

        <button
          onClick={() => setShowManual(!showManual)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700"
        >
          <Keyboard className="w-4 h-4" />
          {showManual ? 'Hide Manual Entry' : 'Enter Code Manually'}
        </button>

        {showManual && (
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
              placeholder="Paste booking ID or QR data..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              autoFocus
            />
            <button
              onClick={handleManualSubmit}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500"
            >
              Verify
            </button>
          </div>
        )}

        <p className="text-center text-xs text-gray-500">
          {cameraError ? 'Use manual entry to check in' : 'Point camera at a booking QR code to check in'}
        </p>
      </div>
    </div>
  );
};

export default QRScanner;
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, X } from 'lucide-react';

const Html5QrcodePlugin = ({ onScan, onError, onStopped, autoStart = true }) => {
  const qrRef = useRef(null);
  const [html5QrCode, setHtml5QrCode] = useState(null);
  const [cameraId, setCameraId] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const initRef = useRef(false);

  // Load script once
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js';
    script.async = true;
    script.onload = () => setLoading(false);
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
      // Safely stop scanner if it's running when component unmounts
      if (html5QrCode && scanning) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [html5QrCode, scanning]);

  const stopScanner = useCallback((instance = html5QrCode) => {
    if (!instance || !scanning) return;
    
    instance.stop()
      .then(() => {
        setScanning(false);
        onStopped();
      })
      .catch(err => {
        console.error("Error stopping scanner:", err);
        setScanning(false);
        onStopped();
      });
  }, [html5QrCode, scanning, onStopped]);

  const startScanner = useCallback((cam = cameraId, instance = html5QrCode) => {
    if (!instance || !cam) return;
    
    setScanning(true);
    instance.start(
      cam,
      { fps: 10, qrbox: { width: 300, height: 200 } },
      text => { 
        onScan(text); 
        stopScanner(instance); 
      },
      errMsg => {
        if (!/parse error|No MultiFormat/.test(errMsg)) console.warn(errMsg);
      }
    ).catch(err => {
      setScanning(false);
      onError(
        err.name === 'NotAllowedError'
          ? 'Permission denied.'
          : `Start failed: ${err.message}`
      );
    });
  }, [cameraId, html5QrCode, onError, onScan, stopScanner]);

  // Initialize scanner once when script loaded
  useEffect(() => {
    if (loading || initRef.current) return;
    initRef.current = true;

    if (qrRef.current && window.Html5Qrcode) {
      const qr = new window.Html5Qrcode(qrRef.current.id);
      setHtml5QrCode(qr);
      
      window.Html5Qrcode.getCameras()
        .then(devices => {
          if (!devices.length) throw new Error('No cameras found');
          setCameras(devices);
          setCameraId(devices[0].id);
          if (autoStart) startScanner(devices[0].id, qr);
        })
        .catch(err => onError(
          err.name === 'NotAllowedError'
            ? 'Camera permission denied.'
            : `Camera error: ${err.message}`
        ));
    }
  }, [loading, onError, autoStart, startScanner]);
 
  if (loading) return <div className="h-32 bg-gray-100 rounded flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="w-64">
      <div id="qr-reader" ref={qrRef} className="w-full h-32" />
      {cameras.length > 0 && (
        <div className="flex items-center justify-between mt-2">
          <select
            className="border p-1 rounded text-sm"
            value={cameraId}
            onChange={e => setCameraId(e.target.value)}
            disabled={scanning}
          >
            {cameras.map(cam => <option key={cam.id} value={cam.id}>{cam.label || cam.id}</option>)}
          </select>
          {!scanning ? (
            <button onClick={() => startScanner()} className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm">Start</button>
          ) : (
            <button onClick={() => stopScanner()} className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm">Stop</button>
          )}
        </div>
      )}
    </div>
  );
};

const BarcodeScannerInput = ({ value, onChange, placeholder='Scan or enter barcode' }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  
  // Handle scan result
  const handleScan = data => {
    onChange(data);
    setScanning(false);
    setError('');
    setIsLocked(true); // Lock the input after successful scan
  };

  const handleError = msg => {
    setError(msg);
    if (/denied/i.test(msg)) setScanning(false);
  };
  
  // Handle input change only if not locked
  const handleInputChange = (e) => {
    if (!isLocked) {
      onChange(e.target.value);
    }
  };
  
  // Clear value and unlock
  const handleClear = () => {
    onChange('');
    setIsLocked(false);
  };
  
  // Toggle scanner and reset lock if opening scanner
  const toggleScanner = () => {
    if (!scanning) {
      setIsLocked(false);
    }
    setScanning(prev => !prev);
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-2">
        <div className="relative flex-grow mr-2">
          <input
            type="text"
            className={`border p-2 rounded text-sm w-full ${isLocked ? 'bg-gray-100' : ''}`}
            placeholder={placeholder}
            value={value || ''}
            onChange={handleInputChange}
            readOnly={isLocked}
          />
          {value && (
            <button 
              onClick={handleClear} 
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              type="button"
            >
              <X size={24}/>
            </button>
          )}
        </div>
        <button
          onClick={toggleScanner}
          className={`flex items-center px-3 py-2 rounded text-sm text-white ${scanning ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          type="button"
        >
          <Camera size={24} className="mr-1"/>{value ? 'scan' : scanning ? 'Close' : 'Scan'}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      {scanning && (
        <div className="inline-block border rounded p-2">
          <Html5QrcodePlugin
            onScan={handleScan}
            onError={handleError}
            onStopped={() => setScanning(false)}
            autoStart
          />
        </div>
      )}
    </div>
  );
};

export default BarcodeScannerInput;
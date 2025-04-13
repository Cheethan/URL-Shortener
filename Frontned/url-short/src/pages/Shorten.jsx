import React, { useState } from 'react';
import { shortenUrl } from '../api/index';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom'; 

const Shorten = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); 

  const handleShorten = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const { shortUrl, qrCode } = await shortenUrl(originalUrl, customAlias, expirationDate, token);
      
      setShortUrl(shortUrl);
      setQrCode(qrCode);
    } catch (err) {
      setError('Error shortening URL');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold text-center mb-4">Shorten URL</h2>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        <form onSubmit={handleShorten}>
          <div className="mb-4">
            <label className="block text-gray-700">Original URL</label>
            <input
              type="url"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Custom Alias (Optional)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Expiration Date (Optional)</label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Generate Short URL
          </button>

          <div className="mt-4 text-center">
            <button 
              type="button"
              onClick={() => navigate('/analytics')} // Use navigate() for routing
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Go to Dashboard
            </button>
          </div>
        </form>

        {shortUrl && (
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">Short URL: <a href={shortUrl} className="text-blue-500">{shortUrl}</a></p>
            <div className="mt-2">
              <QRCodeSVG value={shortUrl} />
            </div>
            <p className="mt-2">Scan the QR code to visit the link.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shorten;

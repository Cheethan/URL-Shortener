import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { QRCodeSVG } from 'qrcode.react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://url-shortener-pfwp.onrender.com/analytics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUrls(response.data);
        setupChartData(response.data);
      } catch (err) {
        setError('Error fetching URLs');
      }
    };
    fetchUrls();
  }, []);

  const setupChartData = (data) => {
    const labels = data.map((url) => url.shortCode);
    const clicks = data.map((url) => url.clickCount || 0);
    setChartData({
      labels,
      datasets: [
        {
          label: 'Clicks',
          data: clicks,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-6xl">


        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate('/shorten')}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Shorten
          </button>
        </div>

        <h2 className="text-xl font-bold text-center mb-6">Dashboard</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Original URL</th>
                <th className="py-2 px-4 text-left">Short URL</th>
                <th className="py-2 px-4 text-left">Created At</th>
                <th className="py-2 px-4 text-left">Clicks</th>
                <th className="py-2 px-4 text-left">QR Code</th>
                <th className="py-2 px-4 text-left">Analytics</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{url.originalUrl}</td>
                  <td className="py-2 px-4">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      {url.shortUrl}
                    </a>
                  </td>
                  <td className="py-2 px-4">
                    {new Date(url.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{url.clickCount}</td>
                  <td className="py-2 px-4">
                    <QRCodeSVG value={url.shortUrl} size={64} />
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => navigate(`/analytics/${url.shortCode}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      View Analytics
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {urls.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-center mb-4">Clicks Overview</h3>
            <div className="max-w-xl mx-auto">
              <Bar data={chartData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

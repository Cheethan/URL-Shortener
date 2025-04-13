import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnalytics } from '../api/index';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsDetail = () => {
  const { shortId } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(shortId || '');

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const data = await getAnalytics(shortId);
        setAnalytics(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [shortId]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/analytics/${searchTerm}`);
  };

  if (loading) return <div className="text-center mt-10">Loading analytics...</div>;

  if (!analytics) return <div className="text-center mt-10">No analytics found.</div>;

  const { logs, stats } = analytics;

  const clickCountsByDate = stats?.clickCountsByDate || [];
  const dateLabels = clickCountsByDate.map((item) => item._id);
  const dateData = clickCountsByDate.map((item) => item.count);

  const deviceBreakdown = stats?.deviceBreakdown || [];
  const deviceLabels = deviceBreakdown.map((item) => item._id);
  const deviceData = deviceBreakdown.map((item) => item.count);

  const totalClicks = dateData.reduce((a, b) => a + b, 0);
  const totalLogs = logs?.length || 0;
  const uniqueDevices = deviceLabels.length;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">

      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/analytics')}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Dashboard
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Analytics for <span className="text-gray-800">{shortId}</span>
      </h2>

      <div className="mb-8 flex justify-center">
        <form onSubmit={handleSearchSubmit} className="flex space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter short URL"
            className="p-2 border border-gray-300 rounded-md w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-100 p-6 rounded-lg shadow-md text-center">
          <h4 className="text-lg font-semibold text-blue-700">Total Clicks</h4>
          <p className="text-3xl font-bold text-blue-900">{totalClicks}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow-md text-center">
          <h4 className="text-lg font-semibold text-green-700">Unique Devices</h4>
          <p className="text-3xl font-bold text-green-900">{uniqueDevices}</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg shadow-md text-center">
          <h4 className="text-lg font-semibold text-purple-700">Logs</h4>
          <p className="text-3xl font-bold text-purple-900">{totalLogs}</p>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-2">Clicks Over Time</h3>
        <Bar
          data={{
            labels: dateLabels,
            datasets: [
              {
                label: 'Clicks',
                data: dateData,
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
              },
            ],
          }}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-2">Device Type Breakdown</h3>
        <Bar
          data={{
            labels: deviceLabels,
            datasets: [
              {
                label: 'Device Count',
                data: deviceData,
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
              },
            ],
          }}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Logs</h3>
        {logs && logs.length > 0 ? (
          <ul className="space-y-4">
            {logs.map((log, index) => (
              <li
                key={index}
                className="p-4 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="text-sm font-medium text-gray-700">
                  <p><strong>Short Code:</strong> {log.shortCode}</p>
                  <p><strong>IP:</strong> {log.ip}</p>
                  <p><strong>Device:</strong> {log.device}</p>
                  <p><strong>Browser:</strong> {log.browser}</p>
                  <p><strong>OS:</strong> {log.os}</p>
                  <p><strong>Location:</strong> {log.location.ip} - {log.location.reason}</p>
                  <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No logs found.</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDetail;

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// 1. Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const SwissSmartDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ensure this URL matches your FastAPI server address
        // If using a proxy, just '/v1/...' is fine. If not, add 'http://localhost:8000'
        const response = await fetch('http://localhost:8000/v1/dashboard/swiss-smart');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load forecast data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 3. Helper to render the chart based on API "type"
  const renderChart = () => {
    if (!data || !data.chart_js) return null;

    const { type, data: chartData, options } = data.chart_js;

    // Default config ensuring responsiveness
    const chartConfig = {
      data: chartData,
      options: {
        ...options,
        responsive: true,
        maintainAspectRatio: false, // Allows height control via CSS
      },
    };

    switch (type) {
      case 'line':
        return <Line {...chartConfig} />;
      case 'bar':
        return <Bar {...chartConfig} />;
      default:
        return <div className="text-red-500">Unsupported chart type: {type}</div>;
    }
  };

  // 4. Loading and Error States
  if (loading) return <div className="p-8 text-center text-gray-500">Loading Smart Forecast...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!data) return null;

  // Destructure the analysis for easier access
  const { analysis } = data;

  return (
    <div className="p-6 border rounded-xl shadow-md bg-white max-w-4xl mx-auto my-6">
      
      {/* HEADER: Smart Advice */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🇨🇭 Swiss Smart Energy</h2>
        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-md">
          <p className="text-blue-800 text-lg font-medium">
            💡 {analysis.advice}
          </p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500 uppercase font-semibold">Current Price</p>
          <p className="text-2xl font-bold text-gray-800">{analysis.current_price} €/MWh</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
          <p className="text-sm text-green-600 uppercase font-semibold">Best Price (Target)</p>
          <p className="text-2xl font-bold text-green-700">{analysis.min_price} €/MWh</p>
          <p className="text-xs text-green-600 mt-1">at {analysis.best_time_label}</p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg text-center border border-red-100">
          <p className="text-sm text-red-600 uppercase font-semibold">Max Price</p>
          <p className="text-2xl font-bold text-red-700">{analysis.max_price} €/MWh</p>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="relative h-80 w-full bg-white rounded-lg">
        {renderChart()}
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        Data source: Volue Insight · EC00 Forecast
      </div>
    </div>
  );
};
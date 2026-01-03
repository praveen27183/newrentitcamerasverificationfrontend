import React from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement,
  Filler
);

const productCategoryPieData = [
  { name: 'Cameras', value: 10 },
  { name: 'Lenses', value: 20 },
  { name: 'Tripods', value: 30 },
  { name: 'Bags', value: 40 },
  { name: 'Accessories', value: 50 },
];

const clickRateBarData = [
  { name: 'Canon', value: 120 },
  { name: 'Nikon', value: 150 },
  { name: 'Sony', value: 180 },
  { name: 'Fujifilm', value: 200 },
  { name: 'Olympus', value: 220 },
];

const monthlyRevenue = [
  { month: 'Jan', revenue: 50000 },
  { month: 'Feb', revenue: 75000 },
  { month: 'Mar', revenue: 90000 },
  { month: 'Apr', revenue: 120000 },
  { month: 'May', revenue: 150000 },
  { month: 'Jun', revenue: 180000 },
];

const topProducts = [
  { name: 'Canon EOS R5', value: 45 },
  { name: 'Sony A7 IV', value: 38 },
  { name: 'Nikon Z7 II', value: 32 },
  { name: 'Fujifilm X-T4', value: 28 },
  { name: 'Sony 24-70mm Lens', value: 22 },
];

export const ProductCategoryPie = ({ data = [] }) => {
  // Sort data by value in descending order and take top 5
  const sortedData = [...data]
    .filter(item => item && item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  
  const chartData = {
    labels: sortedData.map(item => item.name || 'Uncategorized'),
    datasets: [
      {
        data: sortedData.map(item => item.value),
        backgroundColor: [
          '#1A97A9',
          '#2E86C1',
          '#3498DB',
          '#5DADE2',
          '#85C1E9',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 10,
          boxHeight: 10,
          font: {
            size: 12,
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                
                return {
                  text: `${label} (${value})`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: isNaN(value) || value === 0,
                  lineCap: 'round',
                  lineDash: [],
                  lineDashOffset: 0,
                  lineJoin: 'round',
                  lineWidth: 1,
                  strokeStyle: data.datasets[0].backgroundColor[i],
                  pointStyle: 'circle',
                  rotation: 0,
                  borderRadius: 0,
                  datasetIndex: 0,
                  index: i,
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        },
        displayColors: false,
        backgroundColor: '#fff',
        titleColor: '#111827',
        bodyColor: '#6B7280',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  };

  return (
    <div className="h-64">
      {sortedData.length > 0 ? (
        <Pie data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          No category data available
        </div>
      )}
    </div>
  );
};

export const ClickRateBar = ({ data = [] }) => {
  // Filter out invalid data and sort by clicks in descending order
  const sortedData = [...data]
    .filter(item => item && (item.clicks > 0 || item.value > 0))
    .sort((a, b) => (b.clicks || b.value) - (a.clicks || a.value))
    .slice(0, 5);
  
  const chartData = {
    labels: sortedData.map(item => item.name || 'Uncategorized'),
    datasets: [
      {
        label: 'Clicks',
        data: sortedData.map(item => item.clicks || item.value || 0),
        backgroundColor: '#1A97A9',
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.x.toLocaleString()} clicks`;
          }
        },
        displayColors: false,
        backgroundColor: '#fff',
        titleColor: '#111827',
        bodyColor: '#6B7280',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          callback: function(value) {
            return value.toLocaleString('en-US');
          }
        }
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
        }
      },
    },
  };

  return (
    <div className="h-64">
      {sortedData.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          No click data available
        </div>
      )}
    </div>
  );
};

export const RevenueTrendLine = ({ data = [] }) => {
  const chartData = {
    labels: monthlyRevenue.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Revenue (₹)',
        data: monthlyRevenue.map(item => item.revenue),
        borderColor: '#1A97A9',
        backgroundColor: 'rgba(26, 151, 169, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#1A97A9',
        pointBorderColor: '#fff',
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#1A97A9',
        pointHoverBorderColor: '#fff',
        pointHitRadius: 10,
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.y.toLocaleString()}`;
          }
        },
        displayColors: false,
        backgroundColor: '#fff',
        titleColor: '#111827',
        bodyColor: '#6B7280',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
        },
      },
      y: {
        grid: {
          display: true,
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6B7280',
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          },
        },
      },
    },
  };

  return (
    <div className="h-64">
      {data.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          No revenue data available
        </div>
      )}
    </div>
  );
};

export const TopProductsBar = ({ data = [] }) => {
  const chartData = {
    labels: topProducts.map(item => item.name),
    datasets: [
      {
        label: 'Rentals',
        data: topProducts.map(item => item.value),
        backgroundColor: [
          '#1A97A9',
          '#2E86C1',
          '#3498DB',
          '#5DADE2',
          '#85C1E9',
        ],
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.x} rentals`;
          }
        },
        displayColors: false,
        backgroundColor: '#fff',
        titleColor: '#111827',
        bodyColor: '#6B7280',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          stepSize: 10,
        },
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="h-64">
      {data.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          No product data available
        </div>
      )}
    </div>
  );
};

const ProductCharts = () => {
  return (
    <div>
      <h2>Product Category Pie Chart</h2>
      <ProductCategoryPie data={productCategoryPieData} />
      <h2>Click Rate Bar Chart</h2>
      <ClickRateBar data={clickRateBarData} />
      <h2>Revenue Trend Line Chart</h2>
      <RevenueTrendLine data={monthlyRevenue} />
      <h2>Top Products Bar Chart</h2>
      <TopProductsBar data={topProducts} />
    </div>
  );
};

export default ProductCharts;
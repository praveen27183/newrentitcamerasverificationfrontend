import React from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Format date to show month name and year
export const formatMonth = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'short', year: '2-digit' });
};

// Orders Per Month Bar Chart
export const OrdersPerMonthBar = ({ data = [] }) => {
  const chartData = {
    labels: data.map(item => formatMonth(item.month)),
    datasets: [
      {
        label: 'Orders',
        data: data.map(item => item.orders || 0),
        backgroundColor: '#1A97A9',
        borderColor: '#1A97A9',
        borderWidth: 1,
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
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

// Revenue Per Month Line Chart
export const RevenuePerMonthBar = ({ data = [] }) => {
  const chartData = {
    labels: data.map(item => formatMonth(item.month)),
    datasets: [
      {
        label: 'Revenue',
        data: data.map(item => item.revenue || 0),
        borderColor: '#1A97A9',
        backgroundColor: 'rgba(26, 151, 169, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
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
            return '₹' + context.raw.toLocaleString('en-IN');
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

// Customer Signups Doughnut Chart
export const CustomerSignupPie = ({ data = [] }) => {
  const chartData = {
    labels: data.map(item => formatMonth(item.month)),
    datasets: [
      {
        data: data.map(item => item.count || 0),
        backgroundColor: [
          '#1A97A9',
          '#2E86C1',
          '#3498DB',
          '#5DADE2',
          '#85C1E9',
          '#AED6F1',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

// Top Customers Bar Chart
export const TopCustomersBar = ({ data = [] }) => {
  const chartData = {
    labels: data.map(item => item.name || 'Customer'),
    datasets: [
      {
        label: 'Amount Spent',
        data: data.map(item => item.spend || 0),
        backgroundColor: '#1A97A9',
        borderColor: '#1A97A9',
        borderWidth: 1,
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
            return '₹' + context.raw.toLocaleString('en-IN');
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default {
  OrdersPerMonthBar,
  RevenuePerMonthBar,
  CustomerSignupPie,
  TopCustomersBar
};

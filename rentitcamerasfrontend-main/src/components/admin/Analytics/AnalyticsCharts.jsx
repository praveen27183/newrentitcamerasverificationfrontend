import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, 
  LabelList, Text
} from 'recharts';
import { Loader2, AlertCircle, BarChart2, PieChart as PieChartIcon, Users, TrendingUp } from 'lucide-react';
import { cn } from './lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// Error Boundary Component
const ErrorBoundary = ({ children, fallback = null, chartName = 'chart' }) => {
  class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error(`Chart Error (${chartName}):`, error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return fallback || (
          <div className="flex flex-col items-center justify-center p-4 text-center text-red-600 text-sm h-full">
            <AlertCircle className="h-5 w-5 mb-2" />
            <p>Failed to render {chartName}.</p>
            <p className="text-xs text-red-500 mt-1">
              {this.state.error?.message || 'An unknown error occurred'}
            </p>
          </div>
        );
      }
      return this.props.children;
    }
  }
  return <ErrorBoundary>{children}</ErrorBoundary>;
};

// Loading State Component
const ChartContainer = ({ 
  children, 
  isLoading = false, 
  height = 280, 
  loadingText = 'Loading chart data...'
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2" style={{ height }}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <p className="text-sm text-gray-500">{loadingText}</p>
      </div>
    );
  }
  return children;
};

// Empty State Component
const EmptyState = ({ 
  icon: Icon = BarChart2, 
  title = 'No Data Available', 
  description = 'There is no data to display for this chart.' 
}) => (
  <div className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[200px]">
    <Icon className="h-10 w-10 text-gray-300 mb-2" />
    <h4 className="font-medium text-gray-500">{title}</h4>
    <p className="text-sm text-gray-400 mt-1">{description}</p>
  </div>
);

const COLORS = [
  '#1A97A9', '#00C49F', '#FFBB28', '#FF8042', 
  '#A97A1A', '#0088FE', '#FF6B6B', '#8A2BE2',
  '#20B2AA', '#FF6347', '#4682B4', '#DAA520',
  '#32CD32', '#9932CC', '#FF4500', '#4169E1'
];

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Common chart props
const chartProps = {
  barSize: 30,
  margin: { top: 20, right: 30, left: 0, bottom: 0 },
  xAxis: {
    tick: { fill: '#64748b' },
    tickLine: false
  },
  yAxis: {
    tick: { fill: '#64748b' },
    tickLine: false
  },
  tooltip: {
    contentStyle: {
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }
  }
};

const chartCardProps = {
  className: 'h-full flex flex-col',
  headerClassName: 'pb-2',
  contentClassName: 'flex-1 flex flex-col'
};

export function OrdersPerMonthBar({ 
  data = [], 
  isLoading = false, 
  title = 'Orders Growth',
  description = 'Monthly order trends over time',
  className
}) {
  const hasData = Array.isArray(data) && data.length > 0 && data.some(item => item.orders > 0);
  
  const chartData = useMemo(() => {
    if (!hasData) return [];
    return data.map(item => ({
      ...item,
      orders: Number(item.orders) || 0
    }));
  }, [data, hasData]);

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className={chartCardProps.headerClassName}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <span className="text-gray-400 hover:text-gray-600 cursor-help">
                  <BarChart2 className="h-4 w-4" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">{description}</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className={chartCardProps.contentClassName}>
        <ErrorBoundary chartName="orders chart">
          <ChartContainer 
            isLoading={isLoading} 
            loadingText="Loading orders data..."
            height={240}
          >
            {!hasData ? (
              <EmptyState 
                icon={BarChart2}
                title="No Orders Data"
                description="No order data is available for the selected period."
              />
            ) : (
              <div className="w-full h-full min-h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={chartData}
                    margin={chartProps.margin}
                    barSize={28}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => {
                        const [year, month] = value.split('-');
                        return `${new Date(year, month - 1).toLocaleString('default', { month: 'short' })} '${year.slice(2)}`;
                      }}
                    />
                    <YAxis 
                      allowDecimals={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      width={32}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      labelFormatter={(label) => {
                        const [year, month] = label.split('-');
                        return new Date(year, month - 1).toLocaleString('default', { 
                          month: 'long',
                          year: 'numeric' 
                        });
                      }}
                      formatter={(value) => [`${value} orders`, 'Orders']}
                    />
                    <Bar 
                      dataKey="orders"
                      fill="#1A97A9"
                      name="Orders"
                      radius={[4, 4, 0, 0]}
                    >
                      <LabelList 
                        dataKey="orders"
                        position="top"
                        fill="#334155"
                        style={{ fontSize: 11, fontWeight: 500 }}
                        formatter={(value) => value > 0 ? value : ''}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartContainer>
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
}

OrdersPerMonthBar.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      orders: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]).isRequired
    })
  ),
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string
};

export function RevenuePerMonthBar({ 
  data = [], 
  isLoading = false, 
  title = 'Revenue Growth',
  description = 'Monthly revenue trends over time',
  className
}) {
  const hasData = Array.isArray(data) && data.length > 0 && data.some(item => item.revenue > 0);
  
  const chartData = useMemo(() => {
    if (!hasData) return [];
    return data.map(item => ({
      ...item,
      revenue: Number(item.revenue) || 0
    }));
  }, [data, hasData]);

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className={chartCardProps.headerClassName}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <span className="text-gray-400 hover:text-gray-600 cursor-help">
                  <TrendingUp className="h-4 w-4" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">{description}</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className={chartCardProps.contentClassName}>
        <ErrorBoundary chartName="revenue chart">
          <ChartContainer 
            isLoading={isLoading} 
            loadingText="Loading revenue data..."
            height={240}
          >
            {!hasData ? (
              <EmptyState 
                icon={TrendingUp}
                title="No Revenue Data"
                description="No revenue data is available for the selected period."
              />
            ) : (
              <div className="w-full h-full min-h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={chartData}
                    margin={chartProps.margin}
                    barSize={28}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => {
                        const [year, month] = value.split('-');
                        return `${new Date(year, month - 1).toLocaleString('default', { month: 'short' })} '${year.slice(2)}`;
                      }}
                    />
                    <YAxis 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      width={32}
                      tickFormatter={(value) => {
                        if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
                        if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
                        return `₹${value}`;
                      }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      labelFormatter={(label) => {
                        const [year, month] = label.split('-');
                        return new Date(year, month - 1).toLocaleString('default', { 
                          month: 'long',
                          year: 'numeric' 
                        });
                      }}
                      formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                    />
                    <Bar 
                      dataKey="revenue"
                      fill="#00C49F"
                      name="Revenue"
                      radius={[4, 4, 0, 0]}
                    >
                      <LabelList 
                        dataKey="revenue"
                        position="top"
                        fill="#334155"
                        style={{ fontSize: 11, fontWeight: 500 }}
                        formatter={(value) => value > 0 ? formatCurrency(value) : ''}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartContainer>
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
}

RevenuePerMonthBar.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      revenue: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]).isRequired
    })
  ),
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string
};

export function CustomerSignupPie({ 
  data = [], 
  isLoading = false, 
  title = 'Customer Signups',
  description = 'Distribution of customer signups by month',
  className
}) {
  const hasData = Array.isArray(data) && data.length > 0 && data.some(item => item.count > 0);
  
  const chartData = useMemo(() => {
    if (!hasData) return [];
    return data
      .map(item => ({
        ...item,
        count: Number(item.count) || 0,
        month: item.month || 'Unknown'
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [data, hasData]);

  const totalSignups = useMemo(() => {
    return chartData.reduce((sum, item) => sum + (item.count || 0), 0);
  }, [chartData]);

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className={chartCardProps.headerClassName}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <span className="text-gray-400 hover:text-gray-600 cursor-help">
                  <Users className="h-4 w-4" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">{description}</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className={cn(chartCardProps.contentClassName, 'relative')}>
        <ErrorBoundary chartName="customer signups chart">
          <ChartContainer 
            isLoading={isLoading} 
            loadingText="Loading customer data..."
            height={240}
          >
            {!hasData ? (
              <EmptyState 
                icon={Users}
                title="No Signup Data"
                description="No customer signup data is available for the selected period."
              />
            ) : (
              <div className="w-full h-full min-h-[240px]">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-2xl font-bold text-gray-800">{totalSignups}</div>
                  <div className="text-xs text-gray-500">Total Signups</div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="month"
                      labelLine={false}
                      label={({ name, percent }) => 
                        percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
                      }
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          stroke="#fff"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      formatter={(value, name, props) => {
                        const month = props.payload.month;
                        const date = new Date(month);
                        const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                        return [
                          `${value} ${value === 1 ? 'signup' : 'signups'}`,
                          monthName
                        ];
                      }}
                    />
                    <Legend 
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{
                        paddingTop: '16px',
                        fontSize: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      formatter={(value, entry, index) => {
                        const date = new Date(value);
                        if (isNaN(date.getTime())) return value;
                        return date.toLocaleString('default', { month: 'short', year: '2-digit' });
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartContainer>
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
}

CustomerSignupPie.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      count: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]).isRequired
    })
  ),
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string
};

export function TopCustomersBar({ 
  data = [], 
  isLoading = false, 
  title = 'Top Customers',
  description = 'Customers with highest total spend',
  maxCustomers = 7,
  className
}) {
  const hasData = Array.isArray(data) && data.length > 0 && data.some(item => item.spend > 0);
  
  const chartData = useMemo(() => {
    if (!hasData) return [];
    
    return data
      .map(item => ({
        ...item,
        name: item.name || 'Unknown Customer',
        spend: Number(item.spend) || 0,
        initial: item.name ? item.name.charAt(0).toUpperCase() : '?'
      }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, maxCustomers);
  }, [data, hasData, maxCustomers]);

  // Generate a color for each customer based on their name
  const getCustomerColor = useCallback((name) => {
    if (!name) return COLORS[0];
    let hash = 0;
    for (let i = 0; i <name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
  }, []);

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className={chartCardProps.headerClassName}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <span className="text-gray-400 hover:text-gray-600 cursor-help">
                  <Users className="h-4 w-4" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">{description}</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className={chartCardProps.contentClassName}>
        <ErrorBoundary chartName="top customers chart">
          <ChartContainer 
            isLoading={isLoading} 
            loadingText="Loading customer data..."
            height={Math.max(240, (chartData.length || 1) * 36 + 40)}
          >
            {!hasData ? (
              <EmptyState 
                icon={Users}
                title="No Customer Data"
                description="No customer spending data is available."
              />
            ) : (
              <div className="w-full h-full">
                <div className="space-y-4">
                  {chartData.map((customer, index) => {
                    const maxSpend = Math.max(...chartData.map(c => c.spend), 1);
                    const percentage = (customer.spend / maxSpend) * 100;
                    
                    return (
                      <div key={`customer-${index}`} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-white font-medium text-xs"
                              style={{ backgroundColor: getCustomerColor(customer.name) }}
                            >
                              {customer.initial}
                            </div>
                            <span className="font-medium text-gray-700 truncate max-w-[120px]">
                              {customer.name}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(customer.spend)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: getCustomerColor(customer.name)
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </ChartContainer>
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
}

TopCustomersBar.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      spend: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]).isRequired
    })
  ),
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  maxCustomers: PropTypes.number,
  className: PropTypes.string
};

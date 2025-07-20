'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface AnalyticsData {
  period: string;
  statusDistribution: Array<{ status: string; _count: { status: number } }>;
  channelDistribution: Array<{ channel: string; _count: { channel: number } }>;
  dailyStats: Array<{ date: string; total: number; success: number; failed: number }>;
  totalNotifications: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(7);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/logs/analytics?days=${period}`);
      setAnalytics(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch analytics');
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start sending notifications to see analytics.
        </p>
      </div>
    );
  }

  // Status color mapping for consistency
  const statusColors: Record<string, string> = {
    success: '#10B981',   // green
    failed: '#EF4444',    // red
    pending: '#F59E0B',   // yellow
    retrying: '#F59E0B',  // yellow
    scheduled: '#6B7280', // gray
  };

  // Prepare chart data for Status Distribution (Doughnut)
  const statusData = {
    labels: (analytics.statusDistribution || []).map(item =>
      item.status.charAt(0).toUpperCase() + item.status.slice(1)
    ),
    datasets: [
      {
        data: (analytics.statusDistribution || []).map(item => item._count.status),
        backgroundColor: (analytics.statusDistribution || []).map(item => 
          statusColors[item.status.toLowerCase()] || '#9CA3AF'
        ),
        borderWidth: 0,
      },
    ],
  };

  // Channel colors for distinct bars
  const channelColors: Record<string, string> = {
    email: '#3B82F6',    // blue
    sms: '#8B5CF6',      // purple
    app: '#10B981',      // green
    push: '#F59E0B',     // yellow
  };

  // Prepare chart data for Channel Usage (Bar)
  const channelData = {
    labels: (analytics.channelDistribution || []).map(item =>
      item.channel.charAt(0).toUpperCase() + item.channel.slice(1)
    ),
    datasets: [
      {
        label: 'Notifications Sent',
        data: (analytics.channelDistribution || []).map(item => item._count.channel || 0),
        backgroundColor: (analytics.channelDistribution || []).map(item =>
          channelColors[item.channel.toLowerCase()] || '#9CA3AF'
        ),
        borderColor: (analytics.channelDistribution || []).map(item =>
          channelColors[item.channel.toLowerCase()] || '#9CA3AF'
        ),
        borderWidth: 2,
      },
    ],
  };

  // Prepare chart data for Daily Trends (Stacked Bar)
  const dailyStats = analytics.dailyStats || [];
  const dailyBarData = {
    labels: dailyStats
      .map((item, index) => {
        // Since backend is sending empty date objects, generate dates based on period
        const today = new Date();
        const daysAgo = dailyStats.length - 1 - index;
        const date = new Date(today);
        date.setDate(today.getDate() - daysAgo);
        
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      })
      .reverse(),
    datasets: [
      {
        label: 'Success',
        data: dailyStats.map(item => item.success || 0).reverse(),
        backgroundColor: '#10B981', // green
        borderColor: '#059669',
        borderWidth: 1,
      },
      {
        label: 'Failed',
        data: dailyStats.map(item => item.failed || 0).reverse(),
        backgroundColor: '#EF4444', // red
        borderColor: '#DC2626',
        borderWidth: 1,
      },
      {
        label: 'Pending',
        data: dailyStats
          .map(item => Math.max(0, (item.total || 0) - (item.success || 0) - (item.failed || 0)))
          .reverse(),
        backgroundColor: '#F59E0B', // yellow
        borderColor: '#D97706',
        borderWidth: 1,
      },
    ],
  };

  const statusDistribution = analytics.statusDistribution || [];
  const successCount =
    statusDistribution.find(s => s.status.toLowerCase() === 'success')?._count.status || 0;
  const failedCount =
    statusDistribution.find(s => s.status.toLowerCase() === 'failed')?._count.status || 0;
  const pendingCount =
    statusDistribution.find(s => ['pending', 'retrying', 'scheduled'].includes(s.status.toLowerCase()))?._count.status || 0;
  const totalNotifications = analytics.totalNotifications || 0;
  const successRate =
    totalNotifications > 0
      ? ((successCount / totalNotifications) * 100).toFixed(1)
      : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.name}! Here's your notification analytics.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <select
            value={period}
            onChange={e => setPeriod(Number(e.target.value))}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PaperAirplaneIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Sent</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics.totalNotifications.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Successful</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {successCount.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Failed</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {failedCount.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {pendingCount.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Rate Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Success Rate</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-semibold text-green-600">{successRate}%</p>
                <p className="ml-2 text-sm text-gray-500">overall delivery success</p>
              </div>
            </div>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Success: {successCount}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Failed: {failedCount}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span>Pending: {pendingCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status Distribution */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Status Distribution
            </h3>
            {analytics.statusDistribution.length > 0 ? (
              <div className="h-64 flex items-center justify-center">
                <Doughnut
                  data={statusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Channel Usage */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Channel Usage</h3>
            {analytics.channelDistribution.length > 0 ? (
              <div className="h-64">
                <Bar
                  data={channelData}
                  options={{
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
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daily Trends */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Daily Trends</h3>
          {analytics.dailyStats.length > 0 ? (
            <div className="h-64">
              <Bar
                data={dailyBarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

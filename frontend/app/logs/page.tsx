'use client';

import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';
import {
  DocumentTextIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

interface Log {
  id: string;
  to: string;
  channel: string;
  message: string;
  status: string;
  error?: string;
  attempt: number;
  createdAt: string;
}

interface LogsResponse {
  logs: Log[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? text.slice(0, maxLength) + '…' : text;

const stripHtml = (html: string) => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const LogsPage: React.FC = () => {
  const [logsData, setLogsData] = useState<LogsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [page, statusFilter, channelFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (statusFilter) params.append('status', statusFilter);
      if (channelFilter) params.append('channel', channelFilter);

      const response = await api.get(`/logs?${params.toString()}`);
      setLogsData(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch logs');
      console.error('Logs fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'retrying':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <EnvelopeIcon className="h-4 w-4 text-blue-500" />;
      case 'sms':
        return <DevicePhoneMobileIcon className="h-4 w-4 text-green-500" />;
      
      default:
        return <BellIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'retrying':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && logsData && newPage <= logsData.pagination.pages) {
      setPage(newPage);
      setExpandedLogId(null); // Collapse any expanded row on page change
    }
  };

  const resetFilters = () => {
    setStatusFilter('');
    setChannelFilter('');
    setPage(1);
    setExpandedLogId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedLogId((prev) => (prev === id ? null : id));
  };

  const renderMessage = (log: Log) => {
    if (log.channel === 'email') {
      // Sanitize HTML
      const cleanHTML = DOMPurify.sanitize(log.message);
      if (expandedLogId === log.id) {
        return (
          <div
            className="prose max-w-none max-h-48 overflow-auto whitespace-pre-wrap p-2 border rounded bg-gray-50"
            dangerouslySetInnerHTML={{ __html: cleanHTML }}
          />
        );
      } else {
        // Show truncated plain text preview
        return (
          <div
            className="whitespace-pre-wrap max-w-xs truncate"
            title={stripHtml(log.message)}
            style={{ marginTop: '0.25rem', marginBottom: '0.25rem' }}
          >
            {truncate(stripHtml(log.message), 60)}
          </div>
        );
      }
    } else {
      // Non-email channel plain text
      return (
        <div
          className="whitespace-pre-wrap max-w-xs"
          title={log.message}
          style={{ marginTop: '0.25rem', marginBottom: '0.25rem' }}
        >
          {expandedLogId === log.id ? log.message : truncate(log.message, 60)}
        </div>
      );
    }
  };

  if (loading && !logsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notification Logs</h1>
              <p className="text-sm text-gray-500">
                Track all your notification delivery attempts and their status
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center space-x-4">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Statuses</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="retrying">Retrying</option>
                </select>
              </div>
              <div>
                <label htmlFor="channel" className="block text-sm font-medium text-gray-700">
                  Channel
                </label>
                <select
                  id="channel"
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Channels</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Channel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attempt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logsData?.logs.map((log) => (
                <tr
                  key={log.id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    expandedLogId === log.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => toggleExpand(log.id)}
                  style={{ minHeight: expandedLogId === log.id ? '6rem' : '3.5rem' }}
                >
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">{log.to}</div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      {getChannelIcon(log.channel)}
                      <span className="ml-2 capitalize">{log.channel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900 max-w-xs">
                    {renderMessage(log)}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap align-top">
                    <div className="flex items-center">
                      {getStatusIcon(log.status)}
                      <span
                        className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                          log.status
                        )}`}
                      >
                        {log.status}
                      </span>
                    </div>
                    {log.error && (
                      <div
                        className="mt-1 text-xs text-red-600 max-w-xs truncate"
                        title={log.error}
                      >
                        {log.error}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 align-top">
                    {log.attempt}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 align-top">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50 sm:px-6">
          <div className="flex-1 flex justify-between sm:justify-start">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={logsData ? page === logsData.pagination.pages : true}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
              <ChevronRightIcon className="h-5 w-5 ml-1" aria-hidden="true" />
            </button>
          </div>
          <div className="text-sm text-gray-700">
            Page <span className="font-medium">{page}</span> of{' '}
            <span className="font-medium">{logsData?.pagination.pages || 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;

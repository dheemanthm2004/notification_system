'use client';

import React from 'react';
import { 
  ServerIcon, 
  QueueListIcon, 
  ClockIcon, 
  ChartBarIcon, 
  ShieldCheckIcon, 
  CpuChipIcon,
  ArchiveBoxIcon,
  BellIcon,
  CodeBracketIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

export default function ProjectDetailsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <BellIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">DheeNotifications</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enterprise-grade notification infrastructure with multi-channel delivery, 
            advanced scheduling, and comprehensive analytics
          </p>
        </div>

        {/* Project Overview */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <ServerIcon className="h-6 w-6 mr-3 text-blue-600" />
            Project Overview
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">What is DheeNotifications?</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                A production-ready notification platform built to handle enterprise-scale messaging 
                requirements. Supports Email and SMS channels with advanced features like scheduling, 
                bulk operations, retry mechanisms, and comprehensive delivery tracking.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Designed with microservices architecture principles, featuring separate worker processes, 
                queue management, and real-time analytics dashboard.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Capabilities</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Multi-channel delivery (Email, SMS)</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Advanced scheduling & bulk operations</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Fault-tolerant with automatic retries</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Real-time analytics & monitoring</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>RESTful APIs with comprehensive docs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technical Architecture */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <CpuChipIcon className="h-6 w-6 mr-3 text-blue-600" />
            Technical Architecture
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <CodeBracketIcon className="h-5 w-5 mr-2 text-green-600" />
                Frontend Layer
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Next.js 15 with App Router</li>
                <li>• TypeScript for type safety</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Chart.js for analytics</li>
                <li>• JWT-based authentication</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <ServerIcon className="h-5 w-5 mr-2 text-blue-600" />
                Backend Services
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Express.js REST API</li>
                <li>• Background worker processes</li>
                <li>• Cron-based scheduler</li>
                <li>• Middleware for auth & validation</li>
                <li>• Comprehensive error handling</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <ArchiveBoxIcon className="h-5 w-5 mr-2 text-purple-600" />
                Data & Queue Layer
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• PostgreSQL with Prisma ORM</li>
                <li>• Redis for job queuing</li>
                <li>• BullMQ for queue management</li>
                <li>• Optimized database indexes</li>
                <li>• Data persistence & recovery</li>
              </ul>
            </div>
          </div>
        </section>

        {/* System Flow */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <QueueListIcon className="h-6 w-6 mr-3 text-blue-600" />
            System Flow & Processing
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-semibold text-lg mb-2">1. Request Processing</h3>
              <p className="text-gray-700">API receives notification request → Validates payload → Authenticates user → Queues job in Redis</p>
            </div>
            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="font-semibold text-lg mb-2">2. Queue Management</h3>
              <p className="text-gray-700">BullMQ manages job lifecycle → Handles retries & delays → Maintains job state → Provides failure recovery</p>
            </div>
            <div className="border-l-4 border-purple-600 pl-6">
              <h3 className="font-semibold text-lg mb-2">3. Worker Processing</h3>
              <p className="text-gray-700">Background workers pick jobs → Process via SMTP/Twilio → Update database → Log delivery status</p>
            </div>
            <div className="border-l-4 border-orange-600 pl-6">
              <h3 className="font-semibold text-lg mb-2">4. Scheduling & Analytics</h3>
              <p className="text-gray-700">Cron scheduler handles delayed jobs → Real-time dashboard updates → Comprehensive logging & metrics</p>
            </div>
          </div>
        </section>

        {/* Technical Decisions */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Decisions & Rationale</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Why PostgreSQL + Prisma?</h3>
              <p className="text-gray-700">ACID compliance for critical notification data, complex queries for analytics, type-safe database access, and automatic migrations for schema evolution.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Why Redis + BullMQ?</h3>
              <p className="text-gray-700">High-performance job queuing, built-in retry mechanisms, job prioritization, and horizontal scaling capabilities for handling thousands of notifications per minute.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Why Separate Worker Processes?</h3>
              <p className="text-gray-700">Decouples API response time from delivery processing, enables independent scaling, provides fault isolation, and allows for specialized worker configurations.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Why TypeScript Throughout?</h3>
              <p className="text-gray-700">Type safety reduces runtime errors, better IDE support, improved code maintainability, and enhanced developer experience across the full stack.</p>
            </div>
          </div>
        </section>

        {/* Performance & Scalability */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance & Scalability</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-sm text-gray-700">Notifications per minute</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-sm text-gray-700">Delivery success rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">&lt;100ms</div>
              <div className="text-sm text-gray-700">API response time</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Built with ❤️ by <strong>Dheemanth Madaiah</strong>
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <a href="https://dheemanthmadaiah.vercel.app" className="hover:text-blue-600 transition-colors">Portfolio</a>
            <a href="https://github.com/dheemanthm2004" className="hover:text-blue-600 transition-colors">GitHub</a>
            <a href="mailto:dheemanthmadaiah@gmail.com" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <main className="max-w-4xl px-6 md:px-16 py-16 mx-auto text-gray-800 bg-gray-50 space-y-14">
      {/* Overview */}
      <section>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About DheeNotifications</h1>
        <p className="text-base text-gray-700 leading-relaxed">
          <strong>DheeNotifications</strong> is a full-stack notification infrastructure platform supporting <strong>Email</strong>, <strong>SMS</strong>, and <strong>In-App</strong> channels.
          It includes capabilities for scheduled delivery, retries, bulk operations, and full observability. Inspired by internal tools used in production systems at SaaS companies, the goal is to build a real-world backend with job queues, background workers, and complete delivery tracking.
        </p>
      </section>

      {/* Objective */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-300 pb-2">Purpose</h2>
        <p className="text-gray-700 mt-2 leading-relaxed">
          Traditional notification tools abstract away key logic like delivery timing, retry handling, and queue management. This project aims to give developers full control over message lifecycle — from intent to delivery — while ensuring scale, fault-tolerance, and clean APIs.
        </p>
      </section>

      {/* Tech Stack Rationale */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-300 pb-2">Tech Stack & Rationale</h2>
        <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2 text-base leading-relaxed">
          <li><strong>Next.js 15 (App Router):</strong> Used for the dashboard UI. Offers server-side rendering, seamless routing, and great integration with Tailwind. Keeps frontend reactive but minimal.</li>
          <li><strong>Express.js (TypeScript):</strong> Backend API server with typed routes and middleware for auth, validation, and service separation.</li>
          <li><strong>PostgreSQL + Prisma:</strong> SQL-based DB for structured data (users, logs, schedules). Prisma provides type-safe access, migrations, and clean schema modeling. Easy to trace jobs and failures.</li>
          <li><strong>Redis + BullMQ:</strong> Core of the system. Every send request creates a job in Redis. BullMQ handles retries, delays, backoff, and failure states, making the system fault-tolerant.</li>
          <li><strong>Node-Cron:</strong> A scheduler script that polls the DB every minute for jobs scheduled with `sendAt`. When ready, jobs are queued just like real-time ones.</li>
          <li><strong>Socket.IO:</strong> Enables in-app push notifications via WebSocket connection to the frontend.</li>
          <li><strong>SMTP & Twilio:</strong> Used for email and SMS delivery. Configured with appropriate credentials and failover logging.</li>
        </ul>
      </section>

      {/* System Architecture */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-300 pb-2">System Design Overview</h2>
        <ol className="list-decimal list-inside text-gray-700 mt-4 space-y-2 text-base leading-relaxed">
          <li><strong>Frontend:</strong> Authenticated dashboard with role-based access, charts, logs, forms, and bulk upload support.</li>
          <li><strong>API Layer:</strong> Handles requests and immediately offloads to the queue system. Also manages user sessions, tokens, and error handling.</li>
          <li><strong>Queue:</strong> Redis + BullMQ used for async processing. Queue accepts job data, adds retry configs, and assigns IDs for tracking.</li>
          <li><strong>Worker:</strong> A separate long-running process (`notificationWorker.ts`) that processes jobs and updates DB with delivery results.</li>
          <li><strong>Scheduler:</strong> Every minute, `scheduler.ts` checks for scheduled jobs and pushes them into the queue when due.</li>
          <li><strong>DB:</strong> Tracks users, jobs, schedules, logs, retries, and bulk stats. Optimized via indexes and pagination.</li>
        </ol>
      </section>

      {/* Workflow Breakdown */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-300 pb-2">Workflow Examples</h2>
        <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2 text-base leading-relaxed">
          <li><strong>Send Now:</strong> Frontend submits message → API validates → job added to queue → Worker delivers → DB logs outcome</li>
          <li><strong>Schedule:</strong> Job stored with `sendAt` timestamp → Scheduler finds it → queued → Worker processes → DB logs</li>
          <li><strong>Bulk:</strong> CSV parsed → Multiple jobs queued → Each has own retries/logs → Aggregated stats saved in bulk upload model</li>
          <li><strong>Retry:</strong> If a job fails (e.g., SMTP timeout), it's retried automatically. Max retries = 3 by default. Failure reason saved.</li>
        </ul>
      </section>

      {/* Key Features */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-300 pb-2">Core Features</h2>
        <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2 text-base leading-relaxed">
          <li>Multi-channel delivery: Email, SMS, and in-app</li>
          <li>Scheduled notifications with accurate timestamp control</li>
          <li>Job queue with retry, delay, backoff and failure tracking</li>
          <li>Detailed logging of every message sent (status, time, error)</li>
          <li>Bulk sending support with live status tracking</li>
          <li>Built-in API docs for testing and integration</li>
        </ul>
      </section>

      {/* Real World Use */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-300 pb-2">Real-World Applications</h2>
        <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2 text-base leading-relaxed">
          <li>HR/internal tools to notify employees across channels</li>
          <li>Startup SaaS needing scheduled and bulk transactional messaging</li>
          <li>University systems for circulars, alerts, and real-time updates</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="text-sm text-center text-gray-500 pt-12 border-t border-gray-300">
        Built by Dheemanth M · Source on GitHub · Deployed via Vercel + Railway
      </footer>
    </main>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';

export default function ParentDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[Role.PARENT]}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            Parent Dashboard
          </h1>
          <p className="mt-1 text-gray-600">
            Welcome back, <span className="font-semibold">{user?.name}</span>! Manage your student admission applications below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                View My Students
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Check existing student applications, status progression, and fee payment details.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/students"
                className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition"
              >
                Go to Students List →
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Create Student Application
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Submit a new student application to begin the school admission process.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/students/create"
                className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition"
              >
                + Create New Application
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

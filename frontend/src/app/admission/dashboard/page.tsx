'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import { Role } from '@/types';

export default function AdmissionTeamDashboard() {
  const { user } = useAuth();
  const [slotDate, setSlotDate] = useState('15 July');
  const [slotTime, setSlotTime] = useState('10:00 AM');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await fetchApi('/exam-slots', {
        method: 'POST',
        body: JSON.stringify({ date: slotDate, time: slotTime }),
      });
      setSuccessMsg(`Predefined exam slot (${slotDate} — ${slotTime}) created successfully!`);
    } catch (err: any) {
      setError(err.message || 'Failed to create exam slot');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[Role.ADMISSION_TEAM]}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            Admission Team Dashboard
          </h1>
          <p className="mt-1 text-gray-600">
            Welcome back, <span className="font-semibold">{user?.name}</span>! Review student applications and create entrance exam slots.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg font-medium">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Applications Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Manage Applications
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                View student applications, update exam marks, and assign final courses.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/admission/applications"
                className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition"
              >
                View Student Applications →
              </Link>
            </div>
          </div>

          {/* Predefined Exam Slots Creator Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Create Predefined Exam Slot
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Add exam slots for parents to book after fee payment
            </p>

            <form onSubmit={handleCreateSlot} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700">Date</label>
                <input
                  type="text"
                  required
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-1.5 border rounded-md text-sm"
                  placeholder="e.g. 15 July"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Time</label>
                <input
                  type="text"
                  required
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  className="mt-1 block w-full px-3 py-1.5 border rounded-md text-sm"
                  placeholder="e.g. 10:00 AM"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-md shadow transition disabled:opacity-50"
              >
                {actionLoading ? 'Creating...' : '+ Create Exam Slot'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { fetchApi } from '@/lib/api';
import { Role } from '@/types';

export default function CreateStudentPage() {
  const router = useRouter();
  const [studentName, setStudentName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Male');
  const [previousSchool, setPreviousSchool] = useState('');
  const [applyingGrade, setApplyingGrade] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const data = await fetchApi<{ student: { id: string } }>('/students', {
        method: 'POST',
        body: JSON.stringify({
          studentName,
          dateOfBirth,
          gender,
          previousSchool,
          applyingGrade,
        }),
      });

      if (data.student?.id) {
        router.push(`/students/${data.student.id}`);
      } else {
        router.push('/students');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create student application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[Role.PARENT]}>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          Create Student Application
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Enter student details to initiate application
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Student Full Name
            </label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Previous School Name
            </label>
            <input
              type="text"
              required
              value={previousSchool}
              onChange={(e) => setPreviousSchool(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="ABC Public School"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Applying Grade
            </label>
            <input
              type="text"
              required
              value={applyingGrade}
              onChange={(e) => setApplyingGrade(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="e.g. Grade 8"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}

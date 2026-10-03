'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { fetchApi } from '@/lib/api';
import { Role, Student } from '@/types';

export default function StudentsListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchApi<{ students: Student[] }>('/students');
        setStudents(data.students || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load students');
      } finally {
        setIsLoading(false);
      }
    };
    loadStudents();
  }, []);

  return (
    <ProtectedRoute allowedRoles={[Role.PARENT]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
            <p className="mt-1 text-sm text-gray-600">
              List of student applications created under your account
            </p>
          </div>
          <Link
            href="/students/create"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition"
          >
            + New Student
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading student applications...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500 font-medium">No student applications found.</p>
            <Link
              href="/students/create"
              className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
            >
              Create Student Application
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-bold text-gray-900">
                      {student.studentName}
                    </h2>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {student.status}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium text-gray-700">DOB:</span>{' '}
                      {student.dateOfBirth}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Gender:</span>{' '}
                      {student.gender}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Grade:</span>{' '}
                      {student.applyingGrade}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                  <Link
                    href={`/students/${student.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

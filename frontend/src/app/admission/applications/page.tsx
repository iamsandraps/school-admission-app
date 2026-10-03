'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { fetchApi } from '@/lib/api';
import { ApplicationStatus, Role, Student } from '@/types';

export default function AdmissionApplicationsPage() {
  const [applications, setApplications] = useState<Student[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Score Modal State
  const [scoreStudentId, setScoreStudentId] = useState<string | null>(null);
  const [examScoreInput, setExamScoreInput] = useState<number>(85);

  // Course Modal State
  const [courseStudentId, setCourseStudentId] = useState<string | null>(null);
  const [assignedCourseInput, setAssignedCourseInput] = useState<string>('Grade 1');

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const query = selectedStatus
        ? `?status=${encodeURIComponent(selectedStatus)}`
        : '';
      const data = await fetchApi<{ applications: Student[] }>(
        `/admission/applications${query}`,
      );
      setApplications(data.applications || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [selectedStatus]);

  // Submit Exam Score
  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoreStudentId) return;
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await fetchApi(`/admission/${scoreStudentId}/score`, {
        method: 'PATCH',
        body: JSON.stringify({ examScore: Number(examScoreInput) }),
      });
      setSuccessMsg('Entrance exam score recorded successfully!');
      setScoreStudentId(null);
      await loadApplications();
    } catch (err: any) {
      setError(err.message || 'Failed to update exam score');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Course Assignment
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseStudentId) return;
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await fetchApi(`/admission/${courseStudentId}/course`, {
        method: 'PATCH',
        body: JSON.stringify({ assignedCourse: assignedCourseInput }),
      });
      setSuccessMsg('Course assigned and admission completed successfully!');
      setCourseStudentId(null);
      await loadApplications();
    } catch (err: any) {
      setError(err.message || 'Failed to assign course');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[Role.ADMISSION_TEAM]}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Applications Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Review applications, update exam marks, and assign final courses
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filter Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-indigo-500 font-medium"
            >
              <option value="">All Applications</option>
              <option value={ApplicationStatus.APPLICATION_CREATED}>
                Application Created
              </option>
              <option value={ApplicationStatus.REGISTRATION_FEE_PAID}>
                Registration Fee Paid
              </option>
              <option value={ApplicationStatus.SLOT_BOOKED}>Slot Booked</option>
              <option value={ApplicationStatus.EXAM_COMPLETED}>
                Exam Completed
              </option>
              <option value={ApplicationStatus.ADMISSION_COMPLETED}>
                Admission Completed
              </option>
            </select>
          </div>
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

        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-gray-200 text-gray-500">
            No applications found matching the selected filter.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
                  <tr>
                    <th className="p-4">Student Name</th>
                    <th className="p-4">Applying Grade</th>
                    <th className="p-4">Previous School</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Exam Score</th>
                    <th className="p-4">Assigned Course</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-semibold text-gray-900">
                        {app.studentName}
                      </td>
                      <td className="p-4 text-gray-700">{app.applyingGrade}</td>
                      <td className="p-4 text-gray-700">{app.previousSchool}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-gray-800">
                        {app.examScore !== null && app.examScore !== undefined
                          ? `${app.examScore} / 100`
                          : '—'}
                      </td>
                      <td className="p-4 font-semibold text-emerald-700">
                        {app.assignedCourse || '—'}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {app.status === ApplicationStatus.SLOT_BOOKED && (
                          <button
                            onClick={() => {
                              setScoreStudentId(app.id);
                              setExamScoreInput(85);
                            }}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-md shadow-sm transition"
                          >
                            📝 Enter Marks
                          </button>
                        )}
                        {app.status === ApplicationStatus.EXAM_COMPLETED && (
                          <button
                            onClick={() => {
                              setCourseStudentId(app.id);
                              setAssignedCourseInput(app.applyingGrade || 'Grade 1');
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-md shadow-sm transition"
                          >
                            🎓 Assign Course
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for Score Update */}
        {scoreStudentId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Enter Exam Marks (0–100)</h3>
              <form onSubmit={handleScoreSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Marks (0 to 100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={examScoreInput}
                    onChange={(e) => setExamScoreInput(Number(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border rounded-md text-sm font-bold text-indigo-600"
                  />
                </div>
                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setScoreStudentId(null)}
                    className="px-3 py-1.5 border text-xs font-medium rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-md shadow"
                  >
                    Save Score & Advance
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Course Assignment */}
        {courseStudentId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Assign Course</h3>
              <form onSubmit={handleCourseSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 font-semibold mb-1">Select Course</label>
                  <select
                    value={assignedCourseInput}
                    onChange={(e) => setAssignedCourseInput(e.target.value)}
                    className="block w-full px-3 py-2 border rounded-md text-sm font-semibold bg-white"
                  >
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                  </select>
                </div>
                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setCourseStudentId(null)}
                    className="px-3 py-1.5 border text-xs font-medium rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md shadow"
                  >
                    Complete Admission
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

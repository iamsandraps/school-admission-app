'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { fetchApi } from '@/lib/api';
import { ApplicationStatus, Role, Student } from '@/types';

interface ExamSlot {
  id: string;
  date: string;
  time: string;
  isBooked: boolean;
}

export default function StudentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;
  const [student, setStudent] = useState<Student | null>(null);
  const [availableSlots, setAvailableSlots] = useState<ExamSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    studentName: '',
    dateOfBirth: '',
    gender: 'Male',
    previousSchool: '',
    applyingGrade: '',
  });

  const loadStudentData = async () => {
    try {
      const data = await fetchApi<{ student: Student }>(`/students/${studentId}`);
      setStudent(data.student);
      setEditForm({
        studentName: data.student.studentName,
        dateOfBirth: data.student.dateOfBirth,
        gender: data.student.gender,
        previousSchool: data.student.previousSchool,
        applyingGrade: data.student.applyingGrade,
      });

      if (data.student.status === ApplicationStatus.REGISTRATION_FEE_PAID) {
        loadAvailableSlots();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load student details');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      const slotsData = await fetchApi<{ slots: ExamSlot[] }>('/exam-slots');
      setAvailableSlots(slotsData.slots || []);
      if (slotsData.slots && slotsData.slots.length > 0) {
        setSelectedSlotId(slotsData.slots[0].id);
      }
    } catch {
      // Ignore slot fetch error if not applicable
    }
  };

  useEffect(() => {
    loadStudentData();
  }, [studentId]);

  // Handle Mock Fee Payment
  const handlePayRegistrationFee = async () => {
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetchApi<{ message: string; student: Student }>(
        `/registration/${studentId}/pay`,
        {
          method: 'POST',
          body: JSON.stringify({ paymentSuccess: true }),
        },
      );
      setSuccessMsg('Registration fee paid successfully!');
      setStudent(res.student);
      loadAvailableSlots();
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Exam Slot Booking
  const handleBookSlot = async () => {
    if (!selectedSlotId) {
      setError('Please select an available exam slot.');
      return;
    }
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetchApi<{ message: string; student: any }>(
        `/exam-slots/${selectedSlotId}/book/${studentId}`,
        {
          method: 'POST',
        },
      );
      setSuccessMsg('Entrance exam slot booked successfully!');
      await loadStudentData();
    } catch (err: any) {
      setError(err.message || 'Slot booking failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Edit Student Details
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetchApi<{ message: string; student: Student }>(
        `/students/${studentId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(editForm),
        },
      );
      setSuccessMsg('Student details updated successfully!');
      setStudent(res.student);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update student details');
    } finally {
      setActionLoading(false);
    }
  };

  const workflowSteps = [
    ApplicationStatus.APPLICATION_CREATED,
    ApplicationStatus.REGISTRATION_FEE_PAID,
    ApplicationStatus.SLOT_BOOKED,
    ApplicationStatus.EXAM_COMPLETED,
    ApplicationStatus.ADMISSION_COMPLETED,
  ];

  const getStepIndex = (status: ApplicationStatus) => {
    return workflowSteps.indexOf(status);
  };

  return (
    <ProtectedRoute allowedRoles={[Role.PARENT]}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Link
            href="/students"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Students
          </Link>
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
            <p className="mt-2 text-sm text-gray-500">Loading student application...</p>
          </div>
        ) : !student ? (
          <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500 font-medium">Student application not found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Progress Bar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Admission Workflow Progress
              </h2>
              <div className="flex items-center justify-between text-xs font-medium">
                {workflowSteps.map((step, idx) => {
                  const currentIdx = getStepIndex(student.status);
                  const isCompleted = idx <= currentIdx;
                  return (
                    <div
                      key={step}
                      className={`flex-1 text-center py-2 px-1 rounded-md border mx-1 ${
                        isCompleted
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      {step}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Application Overview Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {student.studentName}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Applying for Grade: <span className="font-semibold">{student.applyingGrade}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {student.status === ApplicationStatus.APPLICATION_CREATED && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1.5 text-xs font-semibold bg-white text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 transition"
                    >
                      ✏️ Edit Details
                    </button>
                  )}
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-sm">
                    {student.status}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-base font-bold text-gray-900 border-b pb-2">
                    Student Details {student.status !== ApplicationStatus.APPLICATION_CREATED && '(Read-Only)'}
                  </h2>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 font-medium">Date of Birth:</span>
                      <p className="font-semibold text-gray-900">{student.dateOfBirth}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Gender:</span>
                      <p className="font-semibold text-gray-900">{student.gender}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Previous School:</span>
                      <p className="font-semibold text-gray-900">{student.previousSchool}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Applying Grade:</span>
                      <p className="font-semibold text-gray-900">{student.applyingGrade}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Workflow Details (Score / Course) */}
                {(student.examScore !== null || student.assignedCourse) && (
                  <div className="border-t pt-4">
                    <h2 className="text-base font-bold text-gray-900 mb-3">
                      Admission Evaluation Results
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg border">
                      {student.examScore !== null && student.examScore !== undefined && (
                        <div>
                          <span className="text-gray-500 font-medium">Entrance Exam Score:</span>
                          <p className="font-bold text-indigo-700 text-lg">{student.examScore} / 100</p>
                        </div>
                      )}
                      {student.assignedCourse && (
                        <div>
                          <span className="text-gray-500 font-medium">Assigned Course:</span>
                          <p className="font-bold text-emerald-700 text-lg">{student.assignedCourse}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Workflow Action Cards for Parent */}

            {/* STEP 1: Registration Fee Payment Card */}
            {student.status === ApplicationStatus.APPLICATION_CREATED && (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-emerald-900">
                      Step 2: Pay Registration Fee
                    </h3>
                    <p className="text-sm text-emerald-700 mt-1">
                      Complete mock registration fee payment to proceed to slot booking.
                    </p>
                  </div>
                  <button
                    onClick={handlePayRegistrationFee}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow transition disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : '💳 Pay Registration Fee (Mock)'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Book Entrance Exam Slot Card */}
            {student.status === ApplicationStatus.REGISTRATION_FEE_PAID && (
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-sm space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-blue-900">
                    Step 3: Book Entrance Exam Slot
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Select an available exam slot created by the Admission Team.
                  </p>
                </div>

                {availableSlots.length === 0 ? (
                  <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
                    No available exam slots found. Please ask the Admission Team to create predefined slots.
                  </p>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <select
                      value={selectedSlotId}
                      onChange={(e) => setSelectedSlotId(e.target.value)}
                      className="flex-1 px-3 py-2 border border-blue-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-blue-500 font-medium"
                    >
                      {availableSlots.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          📅 {slot.date} — ⏰ {slot.time}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleBookSlot}
                      disabled={actionLoading || !selectedSlotId}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow transition disabled:opacity-50"
                    >
                      {actionLoading ? 'Booking...' : 'Book Selected Slot'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Slot Booked Info */}
            {student.status === ApplicationStatus.SLOT_BOOKED && (
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-amber-900">
                  Entrance Exam Slot Booked
                </h3>
                <p className="text-sm text-amber-800 mt-1">
                  Your entrance exam slot is confirmed. The Admission Team will enter your score after the exam.
                </p>
              </div>
            )}

            {/* STEP 4: Exam Completed Info */}
            {student.status === ApplicationStatus.EXAM_COMPLETED && (
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-purple-900">
                  Entrance Exam Completed
                </h3>
                <p className="text-sm text-purple-800 mt-1">
                  Exam score entered. Waiting for Admission Team course assignment.
                </p>
              </div>
            )}

            {/* STEP 5: Admission Completed Info */}
            {student.status === ApplicationStatus.ADMISSION_COMPLETED && (
              <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-xl shadow-sm text-center">
                <span className="text-3xl">🎉</span>
                <h3 className="text-xl font-bold text-emerald-900 mt-2">
                  Admission Completed!
                </h3>
                <p className="text-sm text-emerald-800 mt-1">
                  Congratulations! Student has been officially admitted.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Edit Details Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Edit Student Details</h3>
              <form onSubmit={handleUpdateStudent} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Student Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.studentName}
                    onChange={(e) => setEditForm({ ...editForm, studentName: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={editForm.dateOfBirth}
                    onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Gender</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md text-sm bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Previous School</label>
                  <input
                    type="text"
                    required
                    value={editForm.previousSchool}
                    onChange={(e) => setEditForm({ ...editForm, previousSchool: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Applying Grade</label>
                  <input
                    type="text"
                    required
                    value={editForm.applyingGrade}
                    onChange={(e) => setEditForm({ ...editForm, applyingGrade: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 border text-xs font-medium rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md shadow"
                  >
                    Save Changes
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

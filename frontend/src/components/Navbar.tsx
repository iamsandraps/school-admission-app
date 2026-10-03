'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link
            href={
              user?.role === Role.ADMISSION_TEAM
                ? '/admission/dashboard'
                : '/dashboard'
            }
            className="text-xl font-bold text-indigo-600 flex items-center gap-2"
          >
            🏫 School Admission App
          </Link>

          {isAuthenticated && user?.role === Role.PARENT && (
            <nav className="hidden md:flex space-x-4 text-sm font-medium text-gray-700">
              <Link href="/dashboard" className="hover:text-indigo-600 transition">
                Dashboard
              </Link>
              <Link href="/students" className="hover:text-indigo-600 transition">
                My Students
              </Link>
              <Link
                href="/students/create"
                className="hover:text-indigo-600 transition"
              >
                + New Application
              </Link>
            </nav>
          )}

          {isAuthenticated && user?.role === Role.ADMISSION_TEAM && (
            <nav className="hidden md:flex space-x-4 text-sm font-medium text-gray-700">
              <Link
                href="/admission/dashboard"
                className="hover:text-indigo-600 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/admission/applications"
                className="hover:text-indigo-600 transition"
              >
                Student Applications
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  {user.role === Role.ADMISSION_TEAM
                    ? 'ADMISSION TEAM'
                    : 'PARENT'}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-sm px-3 py-1.5 rounded-md text-red-600 border border-red-200 hover:bg-red-50 font-medium transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-3 text-sm font-medium">
              <Link
                href="/login"
                className="px-4 py-2 rounded-md text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

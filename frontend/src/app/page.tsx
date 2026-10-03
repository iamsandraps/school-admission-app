'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === Role.ADMISSION_TEAM) {
        router.push('/admission/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 text-center max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
        Welcome to School Admission Management
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Complete your student application, fee payment, entrance exam slot booking, and track admission status seamlessly.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/login"
          className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-sm transition"
        >
          Parent & Team Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 rounded-lg bg-white text-indigo-600 border border-gray-300 font-medium hover:bg-gray-50 shadow-sm transition"
        >
          Parent Registration
        </Link>
      </div>
    </div>
  );
}

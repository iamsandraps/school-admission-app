import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'School Admission Management',
  description: 'School Admission Workflow Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50 text-gray-900">
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WorkExperienceForm from '@/components/dashboard/WorkExperienceForm';

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true); // state to prevent UI flicker

  useEffect(() => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('app-user-token')
      : null;

    if (!token) {
      router.replace('/'); // redirect to homepage if not logged in
    } else {
      setAuthorized(true);
    }

    setChecking(false);
  }, [router]);

  if (checking) return <p className="text-center mt-10">Checking authentication...</p>;
  if (!authorized) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow text-slate-900">
      <h1 className="text-2xl font-bold mb-6">Create Work Experience</h1>
      <WorkExperienceForm />
    </div>
  );
}

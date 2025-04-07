// src/app/experience/page.tsx
'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GET_WORK_EXPERIENCES, DELETE_WORK_EXPERIENCE } from '@/graphql';
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn';
import { useState } from 'react';
import WorkExperienceForm from '@/components/dashboard/WorkExperienceForm';
import LoginModal from '@/components/auth/LoginModal';

export default function ExperiencePage() {
  const { data, loading, refetch } = useQuery(GET_WORK_EXPERIENCES);
  const [deleteWork] = useMutation(DELETE_WORK_EXPERIENCE);
  const isLoggedIn = useIsLoggedIn();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const formatMonthYear = (timestamp: string | number | null | undefined) => {
    if (!timestamp) return 'N/A';
  
    const date = new Date(timestamp);
    return isNaN(date.getTime())
      ? 'Invalid Date'
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };  

  const handleDelete = async (id: string) => {
    await deleteWork({ variables: { id } });
    setConfirmDelete(null);
    refetch();
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen pt-24 px-6 desktop:px-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-10">Work Experience</h1>

        {loading && <p>Loading...</p>}

        <div className="space-y-4 mb-6">
          {data?.getWorkExperiences.map((item: any) => (
            <div key={item.id} className="group block rounded-lg p-4 transition hover:bg-slate-700 hover:-translate-x-2 relative">
              <div className="flex items-start gap-6">
                <div className="pt-1 w-50 shrink-0 text-sm text-slate-400">
                  {item.startDate ? formatMonthYear(item.startDate) : 'N/A'} – {item.endDate ? formatMonthYear(item.endDate) : 'Now'}
                </div>
                <div className="flex-1">
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                  {item.title}{' '}
                  <span className="text-cyan-300">@ {item.company}</span>
                </h3>
                  <p className="text-slate-300 text-sm mt-2">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.skills.map((tag: string, i: number) => (
                      <span key={`tag-${i}`} className="bg-teal-400/10 text-teal-300 px-3 py-1 text-xs rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ✅ Edit & Delete Buttons */}
              {isLoggedIn && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="text-xs text-yellow-400 hover:underline" onClick={() => {
                    setEditItem(item);
                    setShowForm(true);
                  }}>Edit</button>
                  <button className="text-xs text-red-400 hover:underline" onClick={() => setConfirmDelete(item.id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {isLoggedIn && (
          <>
            <div className="flex justify-center mt-6">
              <button onClick={() => {
                setShowForm(true);
                setEditItem(null);
              }} className="text-cyan-400 hover:underline text-sm">
                ➕ Add Experience
              </button>
            </div>
            {showForm && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center" onClick={() => setShowForm(false)}>
                <div className="bg-white text-black rounded-lg shadow-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{editItem ? 'Edit' : 'Add'} Work Experience</h2>
                    <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-red-600 text-lg font-bold">
                      &times;
                    </button>
                  </div>
                  <WorkExperienceForm
                    isOpen={true}
                    onClose={() => setShowForm(false)}
                    onSuccess={() => {
                      setShowForm(false);
                      refetch();
                    }}
                    initialData={editItem}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="bg-white text-black rounded-lg shadow-lg p-6">
              <p className="mb-4">Are you sure you want to delete this experience?</p>
              <div className="flex justify-end gap-4">
                <button onClick={() => setConfirmDelete(null)} className="text-gray-600 hover:underline">No</button>
                <button onClick={() => handleDelete(confirmDelete)} className="text-red-600 hover:underline">Yes</button>
              </div>
            </div>
          </div>
        )}

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => setShowLoginModal(false)}
        />
      </div>
    </div>
  );
}
// src/app/education/page.tsx
'use client';

import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GET_EDUCATIONS, DELETE_EDUCATION } from '@/graphql';
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn';
import EducationForm from '@/components/dashboard/EducationForm';
import LoginModal from '@/components/auth/LoginModal';

export default function Education() {
  const { data, loading, refetch } = useQuery(GET_EDUCATIONS, {
    fetchPolicy: 'cache-and-network',
  });
  const [deleteEducation] = useMutation(DELETE_EDUCATION);
  const isLoggedIn = useIsLoggedIn();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 425);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);
  
  const handleDelete = async (id: string) => {
    await deleteEducation({ variables: { id } });
    setConfirmDelete(null);
    refetch();
  };

  const formatMonthYear = (timestamp: string | number | null | undefined) => {
    if (!timestamp) return 'N/A';
  
    const parsed = typeof timestamp === 'string' ? Date.parse(timestamp) : Number(timestamp);
    const date = new Date(parsed);
  
    return isNaN(date.getTime())
      ? 'Invalid Date'
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const sortedEducations = [...(data?.getEducations || [])].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className="bg-slate-900 text-white min-h-screen pt-24 px-6 desktop:px-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-10 pl-4">Educations</h1>

        {loading && <p className="pl-4">Loading...</p>}

          {sortedEducations.map((item: any) => {
            return (
              <div
                key={item.id}
                className="group block rounded-lg p-4 transition hover:bg-slate-700 hover:-translate-x-2"
              >
                <div className="flex items-start gap-6">
                  {/* Date */}
                  <div
                    className={`pt-1 text-sm text-slate-400 leading-snug ${
                      isMobile ? 'max-w-[90px]' : 'whitespace-nowrap'
                    }`}
                  >
                    {isMobile ? (
                      <>
                        {item.startDate ? formatMonthYear(item.startDate) : 'N/A'}
                        <div className="text-center">–</div>
                        {item.endDate ? formatMonthYear(item.endDate) : 'Present'}
                      </>
                    ) : (
                      <>
                        {item.startDate ? formatMonthYear(item.startDate) : 'N/A'} –{' '}
                        {item.endDate ? formatMonthYear(item.endDate) : 'Present'}
                      </>
                    )}
                  </div>

                  <div className="flex-1 w-full min-w-0 space-y-2">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      {/* Degree + School */}
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                        {item.degree}{' '}
                        <span className="text-cyan-300">@ {item.school}</span>
                      </h3>
                      
                      {/* Edit/Delete Buttons */}
                      {isLoggedIn && (
                        <div className="flex gap-3">
                          <button
                            className="text-xs text-yellow-400 hover:underline"
                            onClick={() => {
                              setEditItem(item);
                              setShowForm(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="text-xs text-red-400 hover:underline"
                            onClick={() => setConfirmDelete(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Major + Degree + Transcript + Enrollment */}
                    <div className="text-sm text-cyan-400 flex flex-wrap gap-4">
                      <p>{item.program}</p>
                      {item.degreeFileUrl && (
                        <div className="text-sm text-center">
                          📝 <a href={item.degreeFileUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">Degree</a>
                        </div>
                      )}
                      {item.transcriptFileUrl && (
                        <div className="text-sm text-center">
                          📝 <a href={item.transcriptFileUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">Transcript Records</a>
                        </div>
                      )}                      
                      {item.enrollmentFileUrl && (
                        <div className="text-sm text-center">
                          📝 <a href={item.enrollmentFileUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">Enrollment Letter</a>
                        </div>
                      )}    
                    </div>

                    {/* Description */}
                    <div className="text-slate-300 text-sm space-y-1">
                      {item.description
                        .split(/(?<=\.)\s+(?=-)/g) // split after "." and before "-"
                        .map((line: string, idx: number) => (
                          <p key={idx}>{line.trim()}</p>
                        ))}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {item.skills?.map((tag: string, i: number) => (
                        <span
                          key={`tag-${i}`}
                          className="bg-teal-400/10 text-teal-300 px-3 py-1 text-xs rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isLoggedIn && (
          <>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditItem(null);
                }}
                className="text-cyan-400 hover:underline text-sm"
              >
                ➕ Add Education
              </button>
            </div>

            {showForm && (
              <div
                className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center"
                onClick={() => setShowForm(false)}
              >
                <div
                  className="bg-white text-black rounded-lg shadow-xl max-w-2xl w-full p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                      {editItem ? 'Edit' : 'Add'} Education
                    </h2>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-gray-500 hover:text-red-600 text-lg font-bold"
                    >
                      &times;
                    </button>
                  </div>
                  <EducationForm
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
              <p className="mb-4">Are you sure you want to delete this education?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="text-gray-600 hover:underline"
                >
                  No
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="text-red-600 hover:underline"
                >
                  Yes
                </button>
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
  );
}

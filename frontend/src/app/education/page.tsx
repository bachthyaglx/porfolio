'use client';

import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_EDUCATIONS, DELETE_EDUCATION } from '@/graphql';
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn';
import EducationForm from '@/components/dashboard/EducationForm';
import LoginModal from '@/components/auth/LoginModal';

export default function Education() {
  const { data, loading, refetch } = useQuery(GET_EDUCATIONS);
  const [deleteEducation] = useMutation(DELETE_EDUCATION);
  const isLoggedIn = useIsLoggedIn();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deleteEducation({ variables: { id } });
    setConfirmDelete(null);
    refetch();
  };

  return (
    <section className="min-h-screen px-6 py-20 bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-10">Educations</h2>

        {loading && <p>Loading...</p>}

        <div className="space-y-6 mb-6">
          {data?.getEducations.map((edu: any) => {
            const start = edu.startDate
              ? new Date(Number(edu.startDate)).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                })
              : 'Invalid';
            const end = edu.endDate
              ? new Date(Number(edu.endDate)).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                })
              : 'Present';

            return (
              <div
                key={edu.id}
                className="relative group grid grid-cols-[160px_1fr] items-start gap-6 p-6 rounded-lg transition hover:bg-slate-700 hover:-translate-x-2 border-slate-700"
              >
                {/* Edit/Delete buttons */}
                {isLoggedIn && (
                  <div className="absolute top-4 right-4 flex gap-3 z-10">
                    <button
                      className="text-xs text-yellow-400 hover:underline"
                      onClick={() => {
                        setEditItem(edu);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs text-red-400 hover:underline"
                      onClick={() => setConfirmDelete(edu.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}

                {/* Time column */}
                <div className="text-sm text-gray-400">
                  <span className="block">{start} – {end}</span>
                </div>

                {/* Main content */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                      {edu.degree}{' '}
                      <span className="text-cyan-300">@ {edu.school}</span>
                    </h3>
                    <p className="text-cyan-300 text-sm">{edu.program}</p>
                  </div>

                  <p className="text-gray-300 text-sm">{edu.description}</p>

                  <div className="flex flex-wrap gap-2 mt-2 max-w-full">
                    {edu.skills?.map((tag: string, i: number) => (
                      <span
                        key={`tag-${i}`}
                        className="bg-teal-400/10 text-teal-300 px-3 py-1 text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {edu.degreeUrl && (
                    <div className="mt-4">
                      <a
                        href={edu.degreeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full max-w-xs rounded border overflow-hidden group hover:shadow-lg"
                      >
                        {edu.degreeUrl.match(/\.(pdf|docx?|pptx?)$/i) ? (
                          <div className="relative h-96 w-full rounded overflow-hidden">
                            <iframe
                              src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                                edu.degreeUrl
                              )}&embedded=true`}
                              className="absolute top-0 left-0 w-full h-full"
                              style={{ border: 'none' }}
                              allowFullScreen
                              title="Document Preview"
                            />
                          </div>
                        ) : (
                          <img
                            src={edu.degreeUrl}
                            alt="Degree Preview"
                            className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-200"
                          />
                        )}
                      </a>
                    </div>
                  )}
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
    </section>
  );
}

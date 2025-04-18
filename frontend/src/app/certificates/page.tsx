// src/app/certificates/page.tsx
'use client';

import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_CERTIFICATES, DELETE_CERTIFICATE } from '@/graphql';
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn';
import CertificateForm from '@/components/dashboard/CertificateForm';
import LoginModal from '@/components/auth/LoginModal';

export default function Certificates() {
  const { data, loading, refetch } = useQuery(GET_CERTIFICATES, {
    fetchPolicy: 'cache-and-network',
  });
  const [deleteCertificate] = useMutation(DELETE_CERTIFICATE);
  const isLoggedIn = useIsLoggedIn();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  const handleDelete = async (id: string) => {
    await deleteCertificate({ variables: { id } });
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

  return (
    <div className="bg-slate-900 text-white min-h-screen pt-24 px-6 desktop:px-20">
      <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-10 pl-4">Certificates</h1>

      {loading && <p className="pl-4">Loading...</p>}

      <div className="space-y-4 mb-6">
        {[...(data?.getCertificates || [])]
          .sort((a, b) => new Date(b.dateAchieved).getTime() - new Date(a.dateAchieved).getTime())
          .map((item: any) => {
            const fileUrls = Array.isArray(item.certificateFileUrl)
              ? item.certificateFileUrl
              : [item.certificateFileUrl];

            return (
              <div key={item.id} className="group block rounded-lg p-4 transition hover:bg-slate-700 hover:-translate-x-2">
                <div className="flex items-start gap-6">
                  {/* Date */}
                  <div className="pt-1 text-sm text-slate-400 break-words overflow-visible">
                    {formatMonthYear(item.dateAchieved)}
                  </div>

                  <div className="flex-1 w-full min-w-0 space-y-2">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      {/* Title + Organization */}
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                        {item.title}{' '}
                        <span className="text-cyan-300">@ {item.organization}</span>
                      </h3>
                      {/* Buttons Row */}
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
                      {item.skills.map((tag: string, i: number) => (
                        <span
                          key={`tag-${i}`}
                          className="bg-teal-400/10 text-teal-300 px-3 py-1 text-xs rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Certificate files */}
                    <div className="pt-4 flex flex-wrap gap-4">
                      {fileUrls.map((url: string, idx: number) => {
                        const fileName = url.split('/').pop();
                        const isImage = /\.(jpeg|jpg|png|gif|webp)$/i.test(fileName || '');
                        const isPDF = /\.pdf$/i.test(fileName || '');
                        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 425;

                        return (
                          <div
                            key={idx}
                            className="rounded overflow-hidden w-[370px] hover:shadow-xl transition-transform duration-200"
                          >
                            {(isImage || isPDF) ? (
                              <a
                                href={url}
                                {...(!isMobile ? { target: '_blank', rel: 'noreferrer' } : {})}
                                className="block hover:scale-105 transition-transform duration-200"
                              >
                                {isImage ? (
                                  <img
                                    src={url}
                                    alt="Certificate"
                                    className="w-[370px] h-auto object-contain"
                                  />
                                ) : (
                                  <div className="relative">
                                    <iframe
                                      src={url}
                                      title={`pdf-${idx}`}
                                      className="w-[320px] h-[280px] no-scrollbar"
                                      style={{
                                        border: 'none',
                                        overflow: 'hidden',
                                      }}
                                    />
                                    {/* Optional overlay for better clickability or visual feedback */}
                                    <div className="absolute inset-0 z-10"></div>
                                  </div>
                                )}
                              </a>
                            ) : (
                              <div className="p-4 text-sm text-center w-full">
                                📝{' '}
                                <a
                                  href={url}
                                  {...(!isMobile ? { target: '_blank', rel: 'noreferrer' } : {})}
                                  className="text-cyan-400 hover:underline"
                                >
                                  {fileName}
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
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
                ➕ Add Certificate
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
                    <h2 className="text-xl font-semibold">{editItem ? 'Edit' : 'Add'} Certificate</h2>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-gray-500 hover:text-red-600 text-lg font-bold"
                    >
                      &times;
                    </button>
                  </div>
                  <CertificateForm
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
              <p className="mb-4">Are you sure you want to delete this certificate?</p>
              <div className="flex justify-end gap-4">
                <button onClick={() => setConfirmDelete(null)} className="text-gray-600 hover:underline">
                  No
                </button>
                <button onClick={() => handleDelete(confirmDelete)} className="text-red-600 hover:underline">
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
    </div>
  );
}

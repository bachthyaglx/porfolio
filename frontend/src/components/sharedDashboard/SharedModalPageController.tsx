// src/components/shared/SharedModalPageController.tsx
'use client';

import { useQuery, useMutation } from '@apollo/client';
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn';
import { useEffect, useState } from 'react';
import LoginModal from '@/components/auth/LoginModal';
import formatMonthYear from '@/components/utils/formatMonthYear';
import SharedForm from '@/components/sharedDashboard/SharedForm';

interface Props {
  pageTitle: string;
  query: any;
  deleteMutation: any;
  dataKey: string;

  textFields: {
    title: string; // job title, degree
    subtitle?: string; // company, school
    description: string;
    tags: string; // skills
    start?: string; // start date
    end?: string;   // end date
    program?: string;   // program name (for education)
  };

  fileFields?: {
    name: string;
    label: string;
    mode: 'singleupload' | 'multiupload';
  }[];

  formFields: {
    name: string;
    type: 'text' | 'textarea' | 'date';
    label: string;
    required?: boolean;
  }[];

  formTitle?: {
    add: string;
    edit: string;
  };

  createMutation: any;
  editMutation: any;
  uploadMutation: any;
  deleteFileMutation: any;
}

export default function SharedModalPageController({
  pageTitle,
  query,
  deleteMutation,
  dataKey,
  textFields,
  fileFields = [],
  formFields,
  formTitle,
  createMutation,
  editMutation,
  uploadMutation,
  deleteFileMutation,
}: Props) {
  const { data, loading, refetch } = useQuery(query);
  const [deleteItem] = useMutation(deleteMutation);

  const isLoggedIn = useIsLoggedIn();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
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
    await deleteItem({ variables: { id } });
    setConfirmDelete(null);
    refetch();
  };

  const items: any[] = data?.[dataKey] || [];

  return (
    <div className="bg-slate-900 text-white min-h-screen pt-24 px-6 desktop:px-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-10 pl-4">{pageTitle}</h1>

        {loading && <p className="pl-4">Loading...</p>}

        {items.map((item) => (
          <div key={item.id} className="group block rounded-lg p-4 transition hover:bg-slate-700 hover:-translate-x-2">
            <div className="flex items-start gap-6">

              {/* Date */}
              <div className={`pt-1 text-sm text-slate-400 leading-snug ${isMobile ? 'max-w-[90px]' : 'whitespace-nowrap'}`}>
                {(() => {
                  const start = textFields.start ? item[textFields.start] : null;
                  const end = textFields.end ? item[textFields.end] : null;

                  const formattedStart = start ? formatMonthYear(start) : null;
                  const formattedEnd = end ? formatMonthYear(end) : null;

                  if (formattedEnd) {
                    return formattedEnd;
                  }
                  
                  if (formattedStart && formattedEnd) {
                    return isMobile ? (
                      <>
                        {formattedStart}
                        <div className="text-center">–</div>
                        {formattedEnd}
                      </>
                    ) : (
                      <>
                        {formattedStart} – {formattedEnd}
                      </>
                    );
                  }
                })()}
              </div>
                
              {/* Content */}
              <div className="flex-1 w-full min-w-0 space-y-2">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  {/* Title and Subtitle */}
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                    {item[textFields.title]}{' '}
                    {textFields.subtitle && item[textFields.subtitle] && (
                      <span className="text-cyan-300">@ {item[textFields.subtitle]}</span>
                    )}
                  </h3>

                  {/* Edit and Delete Buttons */}
                  {isLoggedIn && (
                    <div className="flex gap-3">
                      <button className="text-xs text-yellow-400 hover:underline" onClick={() => {
                        setEditItem(item);
                        setShowForm(true);
                      }}>
                        Edit
                      </button>
                      <button className="text-xs text-red-400 hover:underline" onClick={() => setConfirmDelete(item.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                  
                {/* Program (if having) and File Links */}
                {fileFields.length > 0 && (
                  <div className="text-sm text-cyan-400 flex flex-wrap gap-4">
                    {textFields.program ? item[textFields.program] : ''}
                    {fileFields.map(({ name, label, mode }) => {
                      const files = item[name];
                      if (!files) return null;

                      if (mode === 'singleupload') {
                        return (
                          <div key={`${name}-${item.id}`} className="text-sm text-center">
                            📝 <a href={files} target="_blank" rel="noreferrer" className="hover:underline">{label}</a>
                          </div>
                        );
                      }

                      if (mode === 'multiupload' && Array.isArray(files)) {
                        return files.map((url: string, idx: number) => {
                          const ext = url.split('.').pop()?.toLowerCase();
                          const isImage = /jpeg|jpg|png|gif|webp/.test(ext || '');
                          if (!isImage) {
                            return (
                              <div key={`${name}-${item.id}-${idx}`} className="text-sm text-center">
                                📝 <a href={url} target="_blank" rel="noreferrer" className="hover:underline">{label}_{idx + 1}</a>
                              </div>
                            );
                          }
                          return null;
                        });
                      }
                    })}
                  </div>
                )}
      
                {/* Description and Tags */}  
                {textFields.description && item[textFields.description] && (
                  <div className="text-slate-300 text-sm space-y-1">
                    {item[textFields.description].split(/(?<=\.)\s+(?=-)/g).map((line: string, idx: number) => (
                      <p key={`desc-line-${idx}`}>{line.trim()}</p>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {textFields.tags && item[textFields.tags] && Array.isArray(item[textFields.tags]) && (
                  <div className="flex flex-wrap gap-2">
                    {item[textFields.tags].map((tag: string, i: number) => (
                      <span key={`tag-${tag}-${i}`} className="bg-teal-400/10 text-teal-300 px-3 py-1 text-xs rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Render image files below tags if mode is multiupload */}
                {fileFields.length > 0 && (
                  <div className="pt-4 flex flex-wrap gap-4">
                    {fileFields.map(({ name, mode }) => {
                      const urls = item[name];
                      if (!Array.isArray(urls)) return null;
                      return urls.map((url: string, idx: number) => {
                        const ext = url.split('.').pop()?.toLowerCase();
                        const isImage = /jpeg|jpg|png|gif|webp/.test(ext || '');
                        const isPDF = /\.pdf$/i.test(url);
                        if (!isImage) return null;
                        return (
                          <div key={`${name}-img-${idx}`} className="rounded overflow-hidden w-[370px] hover:shadow-xl transition-transform duration-200">
                            <a href={url} target="_blank" rel="noreferrer" className="block hover:scale-105 transition-transform duration-200">
                              <img src={url} alt="file" className="w-[370px] h-auto object-contain" />
                            </a>
                          </div>
                        );
                      });
                    })}
                  </div>
                )}

              </div>
            </div>
          </div>
        ))}

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
                ➕ {formTitle?.add || 'Add item'}
              </button>
            </div>

            {showForm && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center" onClick={() => setShowForm(false)}>
                <div className="bg-white text-black rounded-lg shadow-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{editItem ? formTitle?.edit : formTitle?.add}</h2>
                    <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-red-600 text-lg font-bold">
                      &times;
                    </button>
                  </div>
                  <SharedForm
                    isOpen={true}
                    onClose={() => setShowForm(false)}
                    onSuccess={() => {
                      setShowForm(false);
                      refetch();
                    }}
                    initialData={editItem}
                    fields={formFields}
                    fileFields={fileFields}
                    createMutation={createMutation}
                    editMutation={editMutation}
                    uploadMutation={uploadMutation}
                    deleteFileMutation={deleteFileMutation}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="bg-white text-black rounded-lg shadow-lg p-6">
              <p className="mb-4">Are you sure you want to delete this item?</p>
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

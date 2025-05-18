// src/app/projects/[category]/page.tsx
'use client';

import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROJECTS, DELETE_PROJECT } from '@/graphql';
import { useParams } from 'next/navigation';
import { useState, Key } from 'react';
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn';
import LoginModal from '@/components/auth/LoginModal';
import ProjectForm from '@/components/dashboard/ProjectForm';

export default function ProjectsByCategoryPage() {
  const { category } = useParams();
  const { data, loading, refetch } = useQuery(GET_PROJECTS, {
    fetchPolicy: 'cache-and-network',
  });
  const [deleteProject] = useMutation(DELETE_PROJECT);
  const isLoggedIn = useIsLoggedIn();

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const readableTitle = (slug: string | string[] | undefined) => {
    if (typeof slug !== 'string') return 'Projects';
    const map: Record<string, string> = {
      'web-development': 'Web Development',
      'data-science': 'Data Science',
      'embedded-systems': 'Embedded Systems',
    };
    return map[slug] || 'Projects';
  };

  const handleDelete = async (id: string) => {
    await deleteProject({ variables: { id } });
    setConfirmDelete(null);
    refetch();
  };

  const filteredProjects = data?.getProjects.filter(
    (item: any) => item.category === category
  );

  return (
    <div className="bg-slate-900 text-white min-h-screen pt-24 px-6 desktop:px-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-10 pl-4">{readableTitle(category)}</h1>

        {loading && <p className="pl-4">Loading...</p>}

        {!loading && filteredProjects?.length === 0 && (
          <p className="pl-4">No projects found in this category.</p>
        )}

        <div className="space-y-4 mb-6">
          {filteredProjects?.map((item: any) => (
            <div
              key={item.id}
              className="group block rounded-lg p-4 transition hover:bg-slate-700 hover:-translate-x-2"
            >
              <div className="flex-1 w-full min-w-0 space-y-2">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  {/* Title + Link */}
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                    {item.title}
                  </h3>

                  {/* Edit | Delete */}
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

                {/* Project URL */}
                {item.projectUrl && (
                  <div className="text-sm text-cyan-400 flex flex-wrap gap-4">
                    <a
                      href={item.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      🔗 Github
                    </a>
                  </div>
                )}

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
              </div>
            </div>
          ))}
        </div>

        {/* Add Project Button */}
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
                ➕ Add Project
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
                      {editItem ? 'Edit' : 'Add'} Project
                    </h2>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-gray-500 hover:text-red-600 text-lg font-bold"
                    >
                      &times;
                    </button>
                  </div>
                  <ProjectForm
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

        {/* Delete Confirm Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="bg-white text-black rounded-lg shadow-lg p-6">
              <p className="mb-4">Are you sure you want to delete this project?</p>
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
    </div>
  );
}

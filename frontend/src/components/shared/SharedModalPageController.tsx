'use client';

import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn';
import SharedModal from './SharedModal';
import LoginModal from '@/components/auth/LoginModal';

type FieldConfig = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date';
  required?: boolean;
};

type FileFieldConfig = {
  name: string;
  label: string;
  optional?: boolean;
};

interface Props {
  title: string;
  addLabel: string;
  query: any;
  deleteMutation: any;
  createMutation: any;
  editMutation: any;
  deleteFileMutation: any;
  uploadFileMutation: any;
  fields: FieldConfig[];
  fileFields?: FileFieldConfig[];
  itemRender: (
    item: any,
    utils: {
      formatDate: (ts: string | number | null | undefined) => string;
      setEditItem: (item: any) => void;
      setConfirmDelete: (id: string) => void;
    }
  ) => JSX.Element;
}

export default function SharedModalPageController({
  title,
  addLabel,
  query,
  deleteMutation,
  createMutation,
  editMutation,
  deleteFileMutation,
  uploadFileMutation,
  fields,
  fileFields = [],
  itemRender,
}: Props) {
  const { data, loading, refetch } = useQuery(query, {
    fetchPolicy: 'cache-and-network',
  });

  const [deleteItem] = useMutation(deleteMutation);
  const isLoggedIn = useIsLoggedIn();

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const formatDate = (timestamp: string | number | null | undefined) => {
    if (!timestamp) return 'N/A';
    const parsed = typeof timestamp === 'string' ? Date.parse(timestamp) : Number(timestamp);
    const date = new Date(parsed);
    return isNaN(date.getTime())
      ? 'Invalid Date'
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const handleAddClick = () => {
    if (isLoggedIn) {
      setEditItem(null);
      setShowForm(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteItem({ variables: { id } });
    setConfirmDelete(null);
    refetch();
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen pt-24 px-6 desktop:px-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-10 pl-4">{title}</h1>

        {loading && <p className="pl-4">Loading...</p>}

        {(data?.getWorkExperiences || data?.getEducations || []).map((item: any) =>
          itemRender(item, { formatDate, setEditItem, setConfirmDelete })
        )}

        <div className="flex justify-center mt-6">
          <button onClick={handleAddClick} className="text-cyan-400 hover:underline text-sm">
            ➕ {addLabel}
          </button>
        </div>

        {/* Form Modal */}
        <SharedModal
          title={`${editItem ? 'Edit' : 'Add'} ${title}`}
          show={showForm}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            refetch();
          }}
          initialData={editItem}
          fields={fields}
          fileFields={fileFields}
          createMutation={createMutation}
          editMutation={editMutation}
          deleteFileMutation={deleteFileMutation}
          uploadFileMutation={uploadFileMutation}
        />

        {/* Delete Confirm Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="bg-white text-black rounded-lg shadow-lg p-6">
              <p className="mb-4">Are you sure you want to delete this?</p>
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

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
            setShowLoginModal(false);
            setShowForm(true); // immediately reopen form
          }}
        />
      </div>
    </div>
  );
}

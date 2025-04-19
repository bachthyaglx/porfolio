'use client';

import SharedForm from './sharedForm';

interface SharedModalProps {
  title: string;
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
  fields: {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'date';
    required?: boolean;
  }[];
  fileFields?: {
    name: string;
    label: string;
    optional?: boolean;
  }[];
  createMutation: any;
  editMutation: any;
  deleteFileMutation: any;
  uploadFileMutation: any;
}

export default function SharedModal({
  title,
  show,
  onClose,
  onSuccess,
  initialData,
  fields,
  fileFields = [],
  createMutation,
  editMutation,
  deleteFileMutation,
  uploadFileMutation,
}: SharedModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center" onClick={onClose}>
      <div
        className="bg-white text-black rounded-lg shadow-xl max-w-2xl w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-lg font-bold"
          >
            &times;
          </button>
        </div>

        <SharedForm
          isOpen={true}
          onClose={onClose}
          onSuccess={onSuccess}
          initialData={initialData}
          fields={fields}
          fileFields={fileFields}
          createMutation={createMutation}
          editMutation={editMutation}
          deleteFileMutation={deleteFileMutation}
          uploadFileMutation={uploadFileMutation}
        />
      </div>
    </div>
  );
}

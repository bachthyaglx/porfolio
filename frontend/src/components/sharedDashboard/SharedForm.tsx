// src/components/shared/SharedForm.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';

interface FieldConfig {
  name: string;
  type: 'text' | 'textarea' | 'date';
  label: string;
  required?: boolean;
}

interface FileFieldConfig {
  name: string;
  label: string;
  mode: 'singleupload' | 'multiupload';
}

interface SharedFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
  fields: FieldConfig[];
  fileFields?: FileFieldConfig[];
  createMutation: any;
  editMutation: any;
  uploadMutation: any;
  deleteFileMutation: any;
}

export default function SharedForm({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  fields,
  fileFields = [],
  createMutation,
  editMutation,
  uploadMutation,
  deleteFileMutation,
}: SharedFormProps) {
  const [form, setForm] = useState<Record<string, any>>({});
  const [fileInputs, setFileInputs] = useState<Record<string, File[]>>({});
  const [fileUrls, setFileUrls] = useState<Record<string, string[]>>({});
  const [filesToDelete, setFilesToDelete] = useState<Record<string, string[]>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [createItem] = useMutation(createMutation);
  const [editItem] = useMutation(editMutation);
  const [upload] = useMutation(uploadMutation);
  const [deleteFile] = useMutation(deleteFileMutation);

  useEffect(() => {
    if (initialData) {
      const newForm: Record<string, any> = {};

      fields.forEach((field) => {
        const raw = initialData[field.name];
        if (field.type === 'date') {
          newForm[field.name] = raw ? toInputDate(raw) : '';
        } else {
          newForm[field.name] = raw ?? '';
        }
      });

      setForm(newForm);

      const urls: Record<string, string[]> = {};
      fileFields.forEach(({ name }) => {
        const value = initialData[name];
        urls[name] = Array.isArray(value) ? value : value ? [value] : [];
      });
      setFileUrls(urls);
    }
  }, [initialData, fields, fileFields]);

  const toInputDate = (dateStr: string | null | undefined) =>
    dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRemoveFileUrl = (fieldName: string, index: number) => {
    const url = fileUrls[fieldName][index];
    setFilesToDelete((prev) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), url],
    }));
    setFileUrls((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const uploadedFiles: Record<string, string[]> = { ...fileUrls };

      for (const field of fileFields) {
        const name = field.name;

        if (filesToDelete[name]?.length) {
          await Promise.all(
            filesToDelete[name].map((url) => deleteFile({ variables: { fileUrl: url } }))
          );
        }

        if (fileInputs[name]?.length) {
          const variables: any = field.mode === 'singleupload'
            ? { file: fileInputs[name][0] }
            : { files: fileInputs[name] };

          const res = await upload({ variables });
          const urls = field.mode === 'singleupload'
            ? [res?.data?.singleUpload]
            : res?.data?.multiUpload || [];

          uploadedFiles[name] = field.mode === 'singleupload'
            ? urls
            : [...(uploadedFiles[name] || []), ...urls];
        }
      }

      const input: Record<string, any> = { ...form };

      if (fields.find((f) => f.name === 'skills')) {
        input.skills = Array.isArray(form.skills)
          ? form.skills
          : form.skills.split(',').map((s: string) => s.trim());
      }

      fileFields.forEach(({ name, mode }) => {
        input[name] = mode === 'singleupload'
          ? uploadedFiles[name]?.[0] || ''
          : uploadedFiles[name] || [];
      });

      if (form.dateAchieved) {
        input.dateAchieved = new Date(form.dateAchieved).toISOString();
      }

      if (initialData?.id) {
        await editItem({ variables: { id: initialData.id, input } });
      } else {
        await createItem({ variables: { input } });
      }

      setFilesToDelete({});
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('❌ Submit error:', err);
      alert(err.message || '❌ Failed to submit');
    }
  };

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-4">
      {fields.map((field) =>
        field.type === 'textarea' ? (
          <textarea
            key={field.name}
            name={field.name}
            value={form[field.name] || ''}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-black min-h-[150px]"
            placeholder={field.label}
            required={field.required}
          />
        ) : (
          <input
            key={field.name}
            name={field.name}
            type={field.type}
            value={form[field.name] || ''}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-black"
            placeholder={field.label}
            required={field.required}
          />
        )
      )}

      {fileFields.map(({ name, label, mode }) => (
        <div key={name} className="mt-4">
          <label className="block mb-1">{label} <i>(optional)</i></label>

          <input
            ref={(el) => {
              inputRefs.current[name] = el;
            }}
            type="file"
            accept=".pdf,image/*"
            multiple={mode === 'multiupload'}
            onChange={(e) => {
              const newFiles = Array.from(e.target.files || []);
              setFileInputs((prev) => {
                const existing = prev[name] || [];
                return {
                  ...prev,
                  [name]: mode === 'singleupload'
                    ? newFiles
                    : [...existing, ...newFiles.filter(f => !existing.some(ef => ef.name === f.name))],
                };
              });

              if (mode === 'singleupload') {
                setFileUrls((prev) => ({
                  ...prev,
                  [name]: [],
                }));
              }
            }}
            className="mt-2"
          />

          {(fileUrls[name]?.length > 0 || fileInputs[name]?.length > 0) && (
            <ul className="mt-2 text-sm text-black space-y-2">
              {fileUrls[name]?.map((url, idx) => (
                <li key={`${name}-url-${idx}-${url}`} className="flex items-center gap-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline break-all text-blue-600"
                  >
                    {url.split('/').pop()}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveFileUrl(name, idx)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    ❌
                  </button>
                </li>
              ))}
              {fileInputs[name]?.map((file, idx) => (
                <li key={`${name}-file-${idx}-${file.name}`}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <div className="flex justify-end gap-4 mt-6">
        <button type="button" onClick={onClose} className="text-gray-600 hover:underline">
          Cancel
        </button>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {initialData ? 'Update' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

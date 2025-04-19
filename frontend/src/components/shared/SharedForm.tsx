'use client';

import { useEffect, useRef, useState } from 'react';

interface SharedFormProps {
  isOpen: boolean;
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

export default function SharedForm({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  fields,
  fileFields = [],
  createMutation,
  editMutation,
  deleteFileMutation,
  uploadFileMutation,
}: SharedFormProps) {
  const [form, setForm] = useState<Record<string, any>>({});
  const [fileState, setFileState] = useState<Record<string, File | null>>({});
  const [fileUrls, setFileUrls] = useState<Record<string, string | null>>({});
  const [deleteOnSubmit, setDeleteOnSubmit] = useState<Record<string, boolean>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [create] = createMutation();
  const [edit] = editMutation();
  const [uploadFile] = uploadFileMutation();
  const [deleteFile] = deleteFileMutation();

  const toInputDate = (dateStr: string) =>
    dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';

  useEffect(() => {
    if (initialData) {
      const baseForm: Record<string, any> = {};
      fields.forEach((field) => {
        baseForm[field.name] =
          field.type === 'date'
            ? toInputDate(initialData[field.name])
            : Array.isArray(initialData[field.name])
            ? initialData[field.name].join(', ')
            : initialData[field.name] || '';
      });

      const urls: Record<string, string | null> = {};
      fileFields.forEach((f) => {
        urls[f.name] = initialData?.[`${f.name}Url`] || null;
      });

      setForm(baseForm);
      setFileUrls(urls);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalUrls = { ...fileUrls };

      for (const fileField of fileFields) {
        const name = fileField.name;
        if (deleteOnSubmit[name] && !fileState[name] && initialData?.[`${name}Url`]) {
          await deleteFile({ variables: { fileUrl: initialData[`${name}Url`] } });
          finalUrls[name] = '';
        }

        if (fileState[name]) {
          if (initialData?.[`${name}Url`] && !deleteOnSubmit[name]) {
            await deleteFile({ variables: { fileUrl: initialData[`${name}Url`] } });
          }
          const res = await uploadFile({ variables: { file: fileState[name] } });
          finalUrls[name] = res?.data?.singleUpload;
        }
      }

      const input: Record<string, any> = {
        ...Object.fromEntries(
          Object.entries(form).map(([k, v]) => [
            k,
            k === 'skills' ? v.split(',').map((s) => s.trim()) : v,
          ])
        ),
      };

      fileFields.forEach((f) => {
        input[`${f.name}Url`] = finalUrls[f.name] || '';
      });

      if (initialData?.id) {
        await edit({ variables: { id: initialData.id, input } });
      } else {
        await create({ variables: { input } });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('❌ SharedForm Error:', err);
      alert(err.message || 'Something went wrong');
    }
  };

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => {
        const common = {
          name: field.name,
          value: form[field.name] || '',
          onChange: handleChange,
          className: 'w-full border px-3 py-2 rounded text-black',
          required: field.required,
        };

        return (
          <div key={field.name}>
            {field.type === 'textarea' ? (
              <textarea {...common} placeholder={field.label} />
            ) : (
              <input {...common} type={field.type} placeholder={field.label} />
            )}
          </div>
        );
      })}

      {fileFields.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-6">
          {fileFields.map((file) => (
            <div className="flex-1" key={file.name}>
              <label className="block mb-1">
                {file.label} {file.optional && <i>(optional)</i>}
              </label>
              {fileUrls[file.name] ? (
                <div className="text-sm text-blue-600">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={fileUrls[file.name]!}
                      target="_blank"
                      rel="noreferrer"
                      className="underline break-all"
                    >
                      {fileUrls[file.name]!.split('/').pop()}
                    </a>
                    <button
                      type="button"
                      className="text-red-500 text-xs hover:underline"
                      onClick={() => {
                        setFileUrls((prev) => ({ ...prev, [file.name]: null }));
                        setFileState((prev) => ({ ...prev, [file.name]: null }));
                        if (fileRefs.current[file.name]) fileRefs.current[file.name]!.value = '';
                        setDeleteOnSubmit((prev) => ({ ...prev, [file.name]: true }));
                      }}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ) : (
                <input
                  ref={(ref) => (fileRefs.current[file.name] = ref)}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFileState((prev) => ({ ...prev, [file.name]: e.target.files?.[0] || null }))}
                />
              )}
            </div>
          ))}
        </div>
      )}

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

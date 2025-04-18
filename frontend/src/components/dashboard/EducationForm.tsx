// src/components/dashboard/EducationForm.tsx
'use client';

import { useMutation } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { CREATE_EDUCATION, EDIT_EDUCATION, SINGLE_UPLOAD, DELETE_FILE_FROM_S3 } from '@/graphql';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function EducationForm({ isOpen, onClose, onSuccess, initialData }: Props) {
  const [form, setForm] = useState({
    degree: '',
    program: '',
    school: '',
    skills: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [degreeUrl, setDegreeUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadFile] = useMutation(SINGLE_UPLOAD);
  const [deleteFileFromS3] = useMutation(DELETE_FILE_FROM_S3);
  const [createEducation] = useMutation(CREATE_EDUCATION);
  const [editEducation] = useMutation(EDIT_EDUCATION);

  useEffect(() => {
    if (initialData) {
      const safeDate = (value: any) => {
        if (!value) return '';
      
        const date = typeof value === 'number' || !isNaN(Number(value))
          ? new Date(Number(value))
          : new Date(value);
      
        return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
      };
      
      setForm({
        degree: initialData.degree || '',
        program: initialData.program || '',
        school: initialData.school || '',
        skills: (initialData.skills || []).join(', '),
        description: initialData.description || '',
        startDate: safeDate(initialData.startDate),
        endDate: safeDate(initialData.endDate),
      });
      
      setDegreeUrl(initialData.degreeUrl || null);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let uploadedUrl = degreeUrl;

      if (file) {
        // 🧹 Delete old file if exists
        if (initialData?.degreeUrl) {
          await deleteFileFromS3({ variables: { fileUrl: initialData.degreeUrl } });
        }

        // 📤 Upload new file
        const res = await uploadFile({ variables: { file } });
        uploadedUrl = res?.data?.singleUpload;
      }

      const input = {
        degree: form.degree,
        program: form.program,
        school: form.school,
        skills: form.skills.split(',').map((s) => s.trim()),
        description: form.description,
        startDate: new Date(form.startDate).toISOString(),
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
        degreeUrl: uploadedUrl || '',
      };

      if (initialData?.id) {
        await editEducation({ variables: { id: initialData.id, input } });
      } else {
        await createEducation({ variables: { input } });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('❌ Error submitting education:', err);
      alert(err.message || 'Failed to save education');
    }
  };

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="degree" value={form.degree} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" placeholder="Degree" required />
      <input name="program" value={form.program} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" placeholder="Program" required />
      <input name="school" value={form.school} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" placeholder="School" required />
      <input name="skills" value={form.skills} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" placeholder="Skills (comma separated)" />
      <textarea name="description" value={form.description} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black min-h-[200px]" placeholder="Description" required />
      <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" required />
      <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" />

      {degreeUrl && (
        <div className="mt-2 text-sm text-black">
          <div className="inline-flex flex-wrap items-center gap-2 max-w-full">
            <a
              href={degreeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline break-words break-all"
            >
              {degreeUrl.split('/').pop()}
            </a>
            <button
              type="button"
              className="text-red-500 hover:underline text-xs"
              onClick={() => {
                setDegreeUrl(null);
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              ❌
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mt-2"
      />

      {file && <p className="text-sm text-gray-800 mt-1">{file.name}</p>}

      <div className="flex justify-end gap-4 mt-6">
        <button type="button" onClick={onClose} className="text-gray-600 hover:underline">Cancel</button>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {initialData ? 'Update' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

// src/components/dashboard/CertificateForm.tsx
'use client';

import { useMutation } from '@apollo/client';
import { useState, useEffect, useRef } from 'react';
import {
  CREATE_CERTIFICATE,
  EDIT_CERTIFICATE,
  MULTI_UPLOAD,
  DELETE_FILE_FROM_S3,
} from '@/graphql';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function CertificateForm({ isOpen, onClose, onSuccess, initialData }: Props) {
  const [multiUpload] = useMutation(MULTI_UPLOAD);
  const [createCertificate] = useMutation(CREATE_CERTIFICATE);
  const [editCertificate] = useMutation(EDIT_CERTIFICATE);
  const [deleteFileFromS3] = useMutation(DELETE_FILE_FROM_S3);

  const [form, setForm] = useState({
    title: '',
    organization: '',
    skills: '',
    description: '',
    dateAchieved: '',
  });

  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [certificateFileUrls, setCertificateFileUrls] = useState<string[]>([]);
  const [urlsToDelete, setUrlsToDelete] = useState<string[]>([]);
  const certificateInputRef = useRef<HTMLInputElement>(null);

  const toInputDate = (dateStr: string | null | undefined) =>
    dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        organization: initialData.organization || '',
        skills: (initialData.skills || []).join(', '),
        description: initialData.description || '',
        dateAchieved: toInputDate(initialData.dateAchieved),
      });
      setCertificateFileUrls(
        Array.isArray(initialData.certificateFileUrl)
          ? initialData.certificateFileUrl
          : initialData.certificateFileUrl
          ? [initialData.certificateFileUrl]
          : []
      );
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRemoveFileUrl = (index: number) => {
    const url = certificateFileUrls[index];
    setUrlsToDelete((prev) => [...prev, url]);
    setCertificateFileUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let uploadedUrls = certificateFileUrls;

      if (urlsToDelete.length > 0) {
        await Promise.all(urlsToDelete.map((url) => deleteFileFromS3({ variables: { fileUrl: url } })));
      }

      if (certificateFiles.length) {
        const res = await multiUpload({ variables: { files: certificateFiles } });
        uploadedUrls = [...uploadedUrls, ...(res?.data?.multiUpload || [])];
      }

      const input = {
        title: form.title,
        organization: form.organization,
        skills: form.skills.split(',').map((s) => s.trim()),
        description: form.description,
        dateAchieved: new Date(form.dateAchieved).toISOString(),
        certificateFileUrl: uploadedUrls,
      };

      if (initialData?.id) {
        await editCertificate({ variables: { id: initialData.id, input } });
      } else {
        await createCertificate({ variables: { input } });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('❌ Submit error:', err);
      alert(err.message || '❌ Failed to submit');
    }
  };

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" value={form.title} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" placeholder="Title" required />
      <input name="organization" value={form.organization} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" placeholder="Organization" required />
      <input name="skills" value={form.skills} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" placeholder="Skills (comma separated)" />
      <textarea name="description" value={form.description} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black min-h-[200px]" placeholder="Description" required />
      <input name="dateAchieved" type="date" value={form.dateAchieved} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" required />

      <div>
        <span className="text-sm">Certificate Files (PDF/Image)</span>

        {certificateFileUrls.length > 0 && (
          <ul className="mt-2 text-sm text-black space-y-2">
            {certificateFileUrls.map((url, idx) => (
              <li key={idx} className="w-full">
                <div className="inline-flex flex-wrap items-center gap-2 max-w-full">
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline break-words break-all"
                  >
                    {url.split('/').pop()}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveFileUrl(idx)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <input
          ref={certificateInputRef}
          type="file"
          accept=".pdf,image/*"
          multiple
          onChange={(e) => setCertificateFiles(Array.from(e.target.files || []))}
          className="mt-2"
        />

        {certificateFiles.length > 0 && (
          <ul className="mt-2 text-sm text-gray-800">
            {certificateFiles.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button type="button" onClick={onClose} className="text-gray-600 hover:underline">Cancel</button>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {initialData ? 'Update' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

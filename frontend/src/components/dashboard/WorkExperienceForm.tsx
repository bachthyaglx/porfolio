'use client';

import { useMutation } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { CREATE_WORK_EXPERIENCE, EDIT_WORK_EXPERIENCE, SINGLE_UPLOAD, DELETE_FILE_FROM_S3 } from '@/graphql';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function WorkExperienceForm({ isOpen, onClose, onSuccess, initialData }: Props) {
  const [uploadFile] = useMutation(SINGLE_UPLOAD);
  const [createWork] = useMutation(CREATE_WORK_EXPERIENCE);
  const [editWork] = useMutation(EDIT_WORK_EXPERIENCE);
  const [deleteFileFromS3] = useMutation(DELETE_FILE_FROM_S3);

  const [form, setForm] = useState({
    title: '',
    company: '',
    type: '',
    start: '',
    end: '',
    skills: '',
    description: '',
  });

  const [contractFile, setContractFile] = useState<File | null>(null);
  const [feedbackFile, setFeedbackFile] = useState<File | null>(null);
  const [contractFileUrl, setContractFileUrl] = useState<string | null>(null);
  const [feedbackFileUrl, setFeedbackFileUrl] = useState<string | null>(null);

  const contractInputRef = useRef<HTMLInputElement>(null);
  const feedbackInputRef = useRef<HTMLInputElement>(null);

  const [deleteOnSubmit, setDeleteOnSubmit] = useState({ contract: false, feedback: false });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        company: initialData.company || '',
        type: initialData.type || '',
        start: initialData.startDate ? new Date(initialData.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '',
        end: initialData.endDate ? new Date(initialData.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '',
        skills: (initialData.skills || []).join(', '),
        description: initialData.description || '',
      });
      setContractFileUrl(initialData.contractFileUrl || null);
      setFeedbackFileUrl(initialData.feedbackFileUrl || null);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let uploadedContractUrl = contractFileUrl;
      let uploadedFeedbackUrl = feedbackFileUrl;

      // Delete old files only if ❌ was clicked and file wasn't replaced
      if (deleteOnSubmit.contract && !contractFile && !contractFileUrl && initialData?.contractFileUrl) {
        await deleteFileFromS3({ variables: { fileUrl: initialData.contractFileUrl } });
        uploadedContractUrl = '';
      }
      if (deleteOnSubmit.feedback && !feedbackFile && !feedbackFileUrl && initialData?.feedbackFileUrl) {
        await deleteFileFromS3({ variables: { fileUrl: initialData.feedbackFileUrl } });
        uploadedFeedbackUrl = '';
      }

      // Upload new files and optionally delete old ones
      if (contractFile) {
        if (initialData?.contractFileUrl && !deleteOnSubmit.contract) {
          await deleteFileFromS3({ variables: { fileUrl: initialData.contractFileUrl } });
        }
        const res = await uploadFile({ variables: { input: { file: contractFile } } });
        uploadedContractUrl = res?.data?.singleUpload;
      }

      if (feedbackFile) {
        if (initialData?.feedbackFileUrl && !deleteOnSubmit.feedback) {
          await deleteFileFromS3({ variables: { fileUrl: initialData.feedbackFileUrl } });
        }
        const res = await uploadFile({ variables: { input: { file: feedbackFile } } });
        uploadedFeedbackUrl = res?.data?.singleUpload;
      }

      const input = {
        title: form.title,
        company: form.company,
        type: form.type,
        startDate: form.start,
        endDate: form.end || '',
        skills: form.skills.split(',').map((s) => s.trim()),
        description: form.description,
        contractFileUrl: uploadedContractUrl || '',
        feedbackFileUrl: uploadedFeedbackUrl || '',
      };

      if (initialData?.id) {
        await editWork({ variables: { id: initialData.id, input } });
      } else {
        await createWork({ variables: { input } });
      }

      setDeleteOnSubmit({ contract: false, feedback: false });
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
      {/* Form fields... */}
      <input name="title" value={form.title} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" placeholder="Title" required />
      <input name="company" value={form.company} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" placeholder="Company" required />
      <input name="type" value={form.type} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" placeholder="Type" required />
      <input name="start" type="date" value={form.start} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" required />
      <input name="end" type="date" value={form.end} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" />
      <input name="skills" value={form.skills} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" placeholder="Skills (comma separated)" />
      <textarea name="description" value={form.description} onChange={handleChange} className="w-full border px-3 py-2 rounded text-black" placeholder="Description" />

      <div className="flex gap-6">
        {/* Contract File Upload */}
        <div>
          <span className="text-sm">Contract File (PDF)</span>
          {contractFileUrl ? (
            <div className="flex items-center gap-2 mt-1">
              <a href={contractFileUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">
                {contractFileUrl.split('/').pop()}
              </a>
              <button
                type="button"
                onClick={() => {
                  setContractFileUrl(null);
                  setContractFile(null);
                  contractInputRef.current?.value && (contractInputRef.current.value = '');
                  setDeleteOnSubmit((prev) => ({ ...prev, contract: true }));
                }}
                className="text-red-500 text-xs hover:underline"
              >
                ❌
              </button>
            </div>
          ) : (
            <input
              ref={contractInputRef}
              type="file"
              accept=".pdf"
              onChange={(e) => setContractFile(e.target.files?.[0] || null)}
              className="mt-1"
            />
          )}
        </div>

        {/* Feedback File Upload */}
        <div>
          <span className="text-sm">Feedback File (PDF)</span>
          {feedbackFileUrl ? (
            <div className="flex items-center gap-2 mt-1">
              <a href={feedbackFileUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">
                {feedbackFileUrl.split('/').pop()}
              </a>
              <button
                type="button"
                onClick={() => {
                  setFeedbackFileUrl(null);
                  setFeedbackFile(null);
                  feedbackInputRef.current?.value && (feedbackInputRef.current.value = '');
                  setDeleteOnSubmit((prev) => ({ ...prev, feedback: true }));
                }}
                className="text-red-500 text-xs hover:underline"
              >
                ❌
              </button>
            </div>
          ) : (
            <input
              ref={feedbackInputRef}
              type="file"
              accept=".pdf"
              onChange={(e) => setFeedbackFile(e.target.files?.[0] || null)}
              className="mt-1"
            />
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button type="button" onClick={() => {
          setDeleteOnSubmit({ contract: false, feedback: false });
          onClose();
        }} className="text-gray-600 hover:underline">
          Cancel
        </button>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {initialData ? 'Update' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

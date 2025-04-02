'use client';

import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { SINGLE_UPLOAD, CREATE_WORK_EXPERIENCE } from '@/graphql';

export default function WorkExperienceForm() {
  const [uploadFile] = useMutation(SINGLE_UPLOAD);
  const [createWork] = useMutation(CREATE_WORK_EXPERIENCE);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let contractFileUrl: string | null = null;
      let feedbackFileUrl: string | null = null;

      // Upload contract file
      if (contractFile) {
        const res = await uploadFile({
          variables: {
            input: {
              userId: 'admin',
              file: contractFile,
            },
          },
        });
        contractFileUrl = res?.data?.singleUpload;
        if (!contractFileUrl) throw new Error('Contract upload failed');
      }

      // Upload feedback file
      if (feedbackFile) {
        const res = await uploadFile({
          variables: {
            input: {
              userId: 'admin',
              file: feedbackFile,
            },
          },
        });
        feedbackFileUrl = res?.data?.singleUpload;
        if (!feedbackFileUrl) throw new Error('Feedback upload failed');
      }

      // Submit the form with wrapped input object
      await createWork({
        variables: {
          input: {
            title: form.title,
            company: form.company,
            type: form.type,
            startDate: form.start,
            endDate: form.end || '',
            skills: form.skills.split(',').map((s) => s.trim()),
            description: form.description,
            contractFileUrl,
            feedbackFileUrl,
          },
        },
      });

      alert('✅ Work experience created!');
    } catch (err: any) {
      console.error('❌ Submit error:', err);
      alert(err.message || '❌ Upload or creation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded text-slate-900"
        required
      />
      <input
        name="company"
        placeholder="Company"
        value={form.company}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded text-slate-900"
        required
      />
      <input
        name="type"
        placeholder="Type (e.g., Full-time)"
        value={form.type}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded text-slate-900"
        required
      />
      <input
        name="start"
        type="date"
        value={form.start}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded text-slate-900"
        required
      />
      <input
        name="end"
        type="date"
        value={form.end}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded text-slate-900"
      />
      <input
        name="skills"
        placeholder="Skills (comma separated)"
        value={form.skills}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded text-slate-900"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded text-slate-900"
      />

      <div className="flex gap-4">
        <label className="block">
          <span className="text-sm">Contract File (PDF)</span>
          <input type="file" accept=".pdf" onChange={(e) => setContractFile(e.target.files?.[0] || null)} />
        </label>

        <label className="block">
          <span className="text-sm">Feedback File (PDF)</span>
          <input type="file" accept=".pdf" onChange={(e) => setFeedbackFile(e.target.files?.[0] || null)} />
        </label>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
}

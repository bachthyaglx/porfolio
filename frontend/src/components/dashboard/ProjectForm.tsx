// src/components/dashboard/ProjectForm.tsx
'use client';

import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { CREATE_PROJECT, EDIT_PROJECT } from '@/graphql';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function ProjectForm({ isOpen, onClose, onSuccess, initialData }: Props) {
  const [createProject] = useMutation(CREATE_PROJECT);
  const [editProject] = useMutation(EDIT_PROJECT);

  const [form, setForm] = useState({
    title: '',
    description: '',
    skills: '',
    projectUrl: '',
    category: '', // default category
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        skills: (initialData.skills || []).join(', '),
        category: initialData.category,
        projectUrl: initialData.projectUrl || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const input = {
        title: form.title,
        description: form.description,
        skills: form.skills.split(',').map((s) => s.trim()),
        projectUrl: form.projectUrl,
        category: form.category,
      };

      if (initialData?.id) {
        await editProject({ variables: { id: initialData.id, input } });
      } else {
        await createProject({ variables: { input } });
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
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Project title"
        className="w-full border px-4 py-2 rounded text-black"
        required
      />
      <input
        name="skills"
        value={form.skills}
        onChange={handleChange}
        placeholder="Skills (comma separated)"
        className="w-full border px-4 py-2 rounded text-black"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Project description"
        className="w-full border px-4 py-2 rounded text-black min-h-[200px]"
        required
      />
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded text-black"
        required
      >
        <option value="" disabled>Select project</option>
        <option value="web-development">Web Development</option>
        <option value="data-science">Data Science</option>
        <option value="embedded-systems">Embedded Systems</option>
      </select>
      <input
        name="projectUrl"
        value={form.projectUrl}
        onChange={handleChange}
        placeholder="Project URL"
        className="w-full border px-4 py-2 rounded text-black"
        required
      />

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

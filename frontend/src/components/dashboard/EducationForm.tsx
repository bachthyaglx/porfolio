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
  const [uploadFile] = useMutation(SINGLE_UPLOAD);
  const [deleteFileFromS3] = useMutation(DELETE_FILE_FROM_S3);
  const [createEducation] = useMutation(CREATE_EDUCATION);
  const [editEducation] = useMutation(EDIT_EDUCATION);

  const [form, setForm] = useState({
    degree: '',
    program: '',
    school: '',
    skills: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const [degreeFile, setDegreeFile] = useState<File | null>(null);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [enrollmentFile, setEnrollmentFile] = useState<File | null>(null);

  const [degreeFileUrl, setDegreeFileUrl] = useState<string | null>(null);
  const [transcriptFileUrl, setTranscriptFileUrl] = useState<string | null>(null);
  const [enrollmentFileUrl, setEnrollmentFileUrl] = useState<string | null>(null);

  const degreeInputRef = useRef<HTMLInputElement>(null);
  const transcriptInputRef = useRef<HTMLInputElement>(null);
  const enrollmentInputRef = useRef<HTMLInputElement>(null);

  const [deleteOnSubmit, setDeleteOnSubmit] = useState({ degree: false, transcript: false, enrollment: false });

  const toInputDate = (dateStr: string | null | undefined) =>
    dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';

  useEffect(() => {
    if (initialData) {
      setForm({
        degree: initialData.degree || '',
        program: initialData.program || '',
        school: initialData.school || '',
        skills: (initialData.skills || []).join(', '),
        description: initialData.description || '',
        startDate: toInputDate(initialData.startDate),
        endDate: toInputDate(initialData.endDate),
      });
      
      setDegreeFileUrl(initialData.degreeFileUrl || null);
      setTranscriptFileUrl(initialData.transcriptFileUrl || null)
      setEnrollmentFileUrl(initialData.enrollmentFileUrl || null);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let uploadedDegreeUrl = degreeFileUrl;
      let uploadedTranscriptUrl = transcriptFileUrl;
      let uploadedEnrollmentUrl = enrollmentFileUrl;

      // Delete old files only if ❌ was clicked and file wasn't replaced
      if (deleteOnSubmit.degree && !degreeFile && !degreeFileUrl && initialData?.degreeeFileUrl) {
        await deleteFileFromS3({ variables: { fileUrl: initialData.degreeeFileUrl } });
        uploadedDegreeUrl = '';
      }
      if (deleteOnSubmit.transcript && !transcriptFile && !transcriptFileUrl && initialData?.transcriptFileUrl) {
        await deleteFileFromS3({ variables: { fileUrl: initialData.transcriptFileUrl } });
        uploadedTranscriptUrl = '';
      }
      if (deleteOnSubmit.enrollment && !enrollmentFile && !enrollmentFileUrl && initialData?.enrollmentFileUrl) {
        await deleteFileFromS3({ variables: { fileUrl: initialData.enrollmentFileUrl } });
        uploadedEnrollmentUrl = '';
      }

      // Upload new files and optionally delete old ones
      if (degreeFile) {
        if (initialData?.degreeFileUrl && !deleteOnSubmit.degree) {
          await deleteFileFromS3({ variables: { fileUrl: initialData.degreeFileUrl } });
        }
        const res = await uploadFile({ variables: { file: degreeFile } });
        uploadedDegreeUrl = res?.data?.singleUpload;
      }
      if (transcriptFile) {
        if (initialData?.transcriptFileUrl && !deleteOnSubmit.transcript) {
          await deleteFileFromS3({ variables: { fileUrl: initialData.transcriptFileUrl } });
        }
        const res = await uploadFile({ variables: { file: transcriptFile } });
        uploadedTranscriptUrl = res?.data?.singleUpload;
      }
      if (enrollmentFile) {
        if (initialData?.enrollmentFileUrl && !deleteOnSubmit.enrollment) {
          await deleteFileFromS3({ variables: { fileUrl: initialData.enrollmentFileUrl } });
        }
        const res = await uploadFile({ variables: { file: enrollmentFile } });
        uploadedEnrollmentUrl = res?.data?.singleUpload;
      }

      const input = {
        degree: form.degree,
        program: form.program,
        school: form.school,
        skills: form.skills.split(',').map((s) => s.trim()),
        description: form.description,
        startDate: form.startDate,
        endDate: form.endDate || null,
        degreeFileUrl: uploadedDegreeUrl || '',
        transcriptFileUrl: uploadedTranscriptUrl || '',
        enrollmentFileUrl: uploadedEnrollmentUrl || '',
      };

      if (initialData?.id) {
        await editEducation({ variables: { id: initialData.id, input } });
      } else {
        await createEducation({ variables: { input } });
      }

      setDeleteOnSubmit({ degree: false, transcript: false, enrollment: false });
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

      <div className="flex gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          {/* Contract File */}
          <div className="flex-1">
            <label className="block mb-1">Degree File <i>(optional)</i></label>
            {degreeFileUrl ? (
              <div className="text-sm text-blue-600">
                <div className="flex flex-wrap items-center gap-2 break-words max-w-full">
                  <a
                    href={degreeFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline break-all"
                  >
                    {degreeFileUrl.split('/').pop()}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setDegreeFileUrl(null);
                      setDegreeFile(null);
                      degreeInputRef.current?.value && (degreeInputRef.current.value = '');
                      setDeleteOnSubmit((prev) => ({ ...prev, contract: true }));
                    }}
                    className="text-red-500 text-xs hover:underline"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ) : (
              <input
                ref={degreeInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => setDegreeFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
            )}
          </div>
          
          {/* Transcript File */}
          <div className="flex-1">
            <label className="block mb-1">Transcript File <i>(optional)</i></label>
            {transcriptFileUrl ? (
              <div className="text-sm text-blue-600">
                <div className="flex flex-wrap items-center gap-2 break-words max-w-full">
                  <a
                    href={transcriptFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline break-all"
                  >
                    {transcriptFileUrl.split('/').pop()}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setTranscriptFileUrl(null);
                      setTranscriptFile(null);
                      transcriptInputRef.current?.value && (transcriptInputRef.current.value = '');
                      setDeleteOnSubmit((prev) => ({ ...prev, contract: true }));
                    }}
                    className="text-red-500 text-xs hover:underline"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ) : (
              <input
                ref={transcriptInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => setTranscriptFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
            )}
          </div>          
          
          {/* Enrollment File */}
          <div className="flex-1">
            <label className="block mb-1">Enrollment File <i>(optional)</i></label>
            {enrollmentFileUrl ? (
              <div className="text-sm text-blue-600">
                <div className="flex flex-wrap items-center gap-2 break-words max-w-full">
                  <a
                    href={enrollmentFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline break-all"
                  >
                    {enrollmentFileUrl.split('/').pop()}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setEnrollmentFileUrl(null);
                      setEnrollmentFile(null);
                      enrollmentInputRef.current?.value && (enrollmentInputRef.current.value = '');
                      setDeleteOnSubmit((prev) => ({ ...prev, contract: true }));
                    }}
                    className="text-red-500 text-xs hover:underline"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ) : (
              <input
                ref={enrollmentInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => setEnrollmentFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
            )}
          </div>                   
        </div>
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

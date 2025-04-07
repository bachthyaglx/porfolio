// components/UploadFile.tsx
'use client';

import { useMutation, gql } from '@apollo/client';
import { useRef, useState } from 'react';

const SINGLE_UPLOAD = gql`
  mutation SingleUpload($input: SingleFileInput!) {
    singleUpload(input: $input)
  }
`;

export default function UploadFile() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const [singleUploadMutation, { loading: singleLoading }] = useMutation(SINGLE_UPLOAD);

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setIsError(true);
      setMessage('⚠️ Please select file(s)');
      return;
    }

    try {
      setIsError(false);
      const file = selectedFiles[0];
      await singleUploadMutation({
        variables: {
          input: {
            userId: 'test-user',
            file,
          },
        },
      });
      setMessage(`✅ "${file.name}" uploaded successfully!`);
      // reset
      setSelectedFiles(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err: any) {
      setIsError(true);
      setMessage(`❌ ${err.message}`);
    }
  };

  const loading = singleLoading;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow text-slate-900">
      <h2 className="text-lg font-bold mb-4">📤 Upload File(s) to S3</h2>

      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={(e) => setSelectedFiles(e.target.files)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {message && (
        <p className={`mt-4 text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

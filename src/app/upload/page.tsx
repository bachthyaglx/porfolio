// src/app/upload/page.tsx
import UploadFile from '@/components/UploadFile';

export default function UploadPage() {
  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">📤 Upload File to S3</h1>
      <UploadFile />
    </div>
  );
}

// src/components/auth/LoginModal.tsx
'use client';

import LoginForm from './LoginForm';

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay: blur + light black */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose} // click to close dialog
      ></div>

      {/* Modal content */}
      <div className="relative z-10 bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <LoginForm onSuccess={onClose} />
      </div>
    </div>
  );
}

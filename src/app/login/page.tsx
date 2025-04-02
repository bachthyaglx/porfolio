// src/components/auth/LoginModal.tsx
'use client';

import { useState } from 'react';
import LoginModal from '@/components/auth/LoginModal';

export default function LoginPage() {
  const [isModalOpen, setModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <LoginModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
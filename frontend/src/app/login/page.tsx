// src/components/auth/LoginModal.tsx
'use client';

import { useState } from 'react';
import LoginModal from '@/components/auth/LoginModal';

export default function LoginPage() {
  const [isModalOpen, setModalOpen] = useState(true);

  // Define the onLoginSuccess function
  const handleLoginSuccess = () => {
    // Perform actions upon successful login, e.g., redirecting the user
    console.log('Login successful');
    setModalOpen(false); // Close the modal upon successful login
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onLoginSuccess={handleLoginSuccess} // Pass the function here
      />
    </div>
  );
}

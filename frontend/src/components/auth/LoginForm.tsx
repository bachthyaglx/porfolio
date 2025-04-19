// src/components/auth/LoginForm.tsx
'use client';

import { useMutation, useApolloClient } from '@apollo/client';
import { useState } from 'react';
import { LOGIN } from '@/graphql';

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [login] = useMutation(LOGIN); // Removed `loading`
  const client = useApolloClient();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false); // ✅ Custom state to avoid flicker

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true); // ✅ Start submission

    try {
      const { data } = await login({ variables: { username, password } });
      const token = data?.login?.token;

      if (token) {
        localStorage.setItem('app-user-token', token);
        await client.resetStore();
        window.dispatchEvent(new Event('storage')); // trigger updates
        onSuccess();
      } else {
        setErrorMessage('Invalid login credentials.');
      }
    } catch (err) {
      setErrorMessage('An error occurred during login.');
    } finally {
      setSubmitting(false); // ✅ Reset only after full completion
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        disabled={submitting}
        className="w-full border px-3 py-2 rounded text-slate-900"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        disabled={submitting}
        className="w-full border px-3 py-2 rounded text-slate-900"
      />
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        {submitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

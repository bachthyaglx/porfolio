'use client';

import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LOGIN } from '@/graphql';

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();
  const [login, { loading, error }] = useMutation(LOGIN);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ variables: { username, password } });
      const token = res.data?.login?.token;
      console.log(`token used: `, token)
      if (token) {
        localStorage.setItem('app-user-token', token); // Set token to localStorage
        onSuccess(); // close modal
        router.push('/dashboard');
      } else {
        throw new Error('Token không tồn tại');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4 text-slate-800">Login</h2>

      <input
        type="text"
        placeholder="Username"
        className="w-full px-3 py-2 mb-3 border rounded text-slate-900"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-3 py-2 mb-4 border rounded text-slate-900"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
    </form>
  );
}

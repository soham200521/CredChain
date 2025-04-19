import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Admin() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      // Fix: Use full backend URL
      const response = await axios.post(
        'http://localhost:5000/verifypassword',
        { password: data.password }
      );
      if (response.data.success) {
        navigate('/verify-docs');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Invalid password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-8 flex flex-col font-sans">
      <main className="flex-1 w-full max-w-md mx-auto flex flex-col justify-center py-16 mt-3">
        <div className="bg-gradient-to-br from-[#1f1f1f] via-[#2a2a2a] to-[#1f1f1f] rounded-3xl p-8 md:p-10 shadow-[0_0_40px_#ff80bf55] border border-white/10 backdrop-blur-xl animate-fade-in-up">
          <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
            Admin Login
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Password</label>
              <input
                type="password"
                {...register('password', { required: true })}
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter admin password"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-xl text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-pink-400/50 transition"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

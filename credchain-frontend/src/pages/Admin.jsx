import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Admin() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/verifypassword', {
        adminId: adminId.trim(),
        password: password.trim()
      });

      if (response.data.success) {
        sessionStorage.setItem('adminAuthenticated', 'true');
        navigate('/verify-docs');
      } else {
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Admin ID or Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e] text-white px-4 flex flex-col justify-center items-center font-sans">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_50px_#4f8cfb40] border border-[#4f8cfb]/30 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] flex items-center justify-center text-3xl shadow-lg border border-white/20">
            🔐
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-wider">
            Admin <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4f8cfb] to-[#a770ef]">Portal</span>
          </h2>
          <p className="text-[#b8cfff] text-sm">Log in to review & verify applicant documents</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#b8cfff] mb-2">Admin ID</label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f8cfb] focus:border-transparent transition"
              placeholder="Enter Admin ID"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#b8cfff] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f8cfb] focus:border-transparent transition"
              placeholder="Enter Password"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-medium text-center">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] rounded-xl text-white font-bold text-lg shadow-lg hover:scale-[1.02] hover:shadow-[0_0_30px_#a770ef66] active:scale-95 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In as Admin'}
          </button>
        </form>

        
      </div>
    </div>
  );
}


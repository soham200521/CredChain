import { useState } from 'react';
import WalletConnector from '../components/WalletConnector';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    aadhar: '',
    pan: '',
    phone: '',
    address: '',
  });
  const { user, isLoading, isAuthenticated } = useAuth0();
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const aadharRegex = /^\d{12}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const phoneRegex = /^\d{10}$/;

    if (!nameRegex.test(formData.firstName)) return 'First name should contain only letters.';
    if (!nameRegex.test(formData.lastName)) return 'Last name should contain only letters.';
    if (!aadharRegex.test(formData.aadhar)) return 'Aadhar must be a 12-digit numbers ONLY.';
    if (!panRegex.test(formData.pan)) return 'Invalid PAN format (e.g., ABCDE1234F).';
    if (!phoneRegex.test(formData.phone)) return 'Phone must be a 10-digit numbers ONLY.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user || !user.email) {
      setErr('User info not available. Please log in again.');
      return;
    }
  
    const validationError = validateForm();
    if (validationError) {
      setErr(validationError);
      return;
    }
  
    try {
      const response = await axios.post('/signup', {
        formData,
        email: user.email,
      });
  
      if (response.status === 200) {
        setErr('');
        navigate('/');
      } else if (response.status === 409) {
        setErr(response.data.message || 'User already exists.');
      } else {
        setErr('Unexpected response from server.');
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        setErr(error.response.data.message);
      } else {
        setErr('Server error, please try again later.');
      }
    }
    
  };
  

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-10 w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center drop-shadow">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Aadhar Number</label>
              <input
                name="aadhar"
                value={formData.aadhar}
                onChange={handleChange}
                type="text"
                maxLength="12"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">PAN Card</label>
              <input
                name="pan"
                value={formData.pan.toUpperCase()}
                onChange={handleChange}
                type="text"
                maxLength="10"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                maxLength="10"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
          </div>

          {err && <p className="text-red-600 font-medium text-center">{err}</p>}

          <div className="border-t border-gray-300 pt-6 flex flex-col items-center">
            <WalletConnector onConnect={() => console.log("Wallet connected!")} />
            <button
              type="submit"
              className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg shadow hover:bg-green-700 transition-colors font-semibold text-lg"
            >
              Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

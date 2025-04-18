import { useForm } from 'react-hook-form';
import WalletConnector from '../components/WalletConnector';

export default function SignUp() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Add blockchain interaction here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-10 w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center drop-shadow">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                {...register("firstName", { required: true })}
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block mb-1 text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                {...register("lastName", { required: true })}
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label htmlFor="aadhar" className="block mb-1 text-sm font-medium text-gray-700">
                Aadhar Number
              </label>
              <input
                id="aadhar"
                {...register("aadhar", { required: true })}
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label htmlFor="pan" className="block mb-1 text-sm font-medium text-gray-700">
                PAN Card
              </label>
              <input
                id="pan"
                {...register("pan", { required: true })}
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                {...register("phone", { required: true })}
                type="tel"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                {...register("email", { required: true })}
                type="email"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="address"
                {...register("address", { required: true })}
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
          </div>
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

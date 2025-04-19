import { useForm } from 'react-hook-form';
import WalletConnector from '../components/WalletConnector';

export default function SignUp() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Add blockchain interaction here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e]">
      <div className="bg-white/15 backdrop-blur-lg rounded-3xl shadow-[0_0_40px_#4f8cfb40] p-10 w-full max-w-2xl border border-[#4f8cfb]/30">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] drop-shadow">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-white">
                First Name
              </label>
              <input
                id="firstName"
                {...register("firstName", { required: true })}
                type="text"
                className="w-full rounded-lg border border-[#4f8cfb]/40 px-4 py-2 bg-white/20 text-white placeholder-[#b8cfff] focus:outline-none focus:ring-2 focus:ring-[#a770ef] focus:border-[#a770ef]"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block mb-1 text-sm font-medium text-white">
                Last Name
              </label>
              <input
                id="lastName"
                {...register("lastName", { required: true })}
                type="text"
                className="w-full rounded-lg border border-[#4f8cfb]/40 px-4 py-2 bg-white/20 text-white placeholder-[#b8cfff] focus:outline-none focus:ring-2 focus:ring-[#a770ef] focus:border-[#a770ef]"
                required
              />
            </div>
            <div>
              <label htmlFor="aadhar" className="block mb-1 text-sm font-medium text-white">
                Aadhar Number
              </label>
              <input
                id="aadhar"
                {...register("aadhar", { required: true })}
                type="text"
                className="w-full rounded-lg border border-[#4f8cfb]/40 px-4 py-2 bg-white/20 text-white placeholder-[#b8cfff] focus:outline-none focus:ring-2 focus:ring-[#a770ef] focus:border-[#a770ef]"
                required
              />
            </div>
            <div>
              <label htmlFor="pan" className="block mb-1 text-sm font-medium text-white">
                PAN Card
              </label>
              <input
                id="pan"
                {...register("pan", { required: true })}
                type="text"
                className="w-full rounded-lg border border-[#4f8cfb]/40 px-4 py-2 bg-white/20 text-white placeholder-[#b8cfff] focus:outline-none focus:ring-2 focus:ring-[#a770ef] focus:border-[#a770ef]"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-1 text-sm font-medium text-white">
                Phone Number
              </label>
              <input
                id="phone"
                {...register("phone", { required: true })}
                type="tel"
                className="w-full rounded-lg border border-[#4f8cfb]/40 px-4 py-2 bg-white/20 text-white placeholder-[#b8cfff] focus:outline-none focus:ring-2 focus:ring-[#a770ef] focus:border-[#a770ef]"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-white">
                Email
              </label>
              <input
                id="email"
                {...register("email", { required: true })}
                type="email"
                className="w-full rounded-lg border border-[#4f8cfb]/40 px-4 py-2 bg-white/20 text-white placeholder-[#b8cfff] focus:outline-none focus:ring-2 focus:ring-[#a770ef] focus:border-[#a770ef]"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block mb-1 text-sm font-medium text-white">
                Address
              </label>
              <input
                id="address"
                {...register("address", { required: true })}
                type="text"
                className="w-full rounded-lg border border-[#4f8cfb]/40 px-4 py-2 bg-white/20 text-white placeholder-[#b8cfff] focus:outline-none focus:ring-2 focus:ring-[#a770ef] focus:border-[#a770ef]"
                required
              />
            </div>
          </div>
          <div className="border-t border-[#4f8cfb]/30 pt-6 flex flex-col items-center">
            <WalletConnector onConnect={() => console.log("Wallet connected!")} />
            <button
              type="submit"
              className="mt-6 bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] text-white px-8 py-3 rounded-lg shadow hover:from-[#a770ef] hover:to-[#4f8cfb] transition-colors font-semibold text-lg"
            >
              Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

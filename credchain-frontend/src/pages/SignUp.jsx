import { useForm } from 'react-hook-form';
import WalletConnector from '../components/WalletConnector';

export default function SignUp() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Add blockchain interaction here
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Sign Up</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <InputField label="First Name" name="firstName" register={register} required />
          <InputField label="Last Name" name="lastName" register={register} required />
          <InputField label="Aadhar Number" name="aadhar" register={register} required />
          <InputField label="PAN Card" name="pan" register={register} required />
          <InputField label="Phone Number" name="phone" type="tel" register={register} required />
          <InputField label="Email" name="email" type="email" register={register} required />
          <InputField label="Address" name="address" register={register} required />
        </div>

        <div className="border-t pt-6">
          <WalletConnector onConnect={() => console.log("Wallet connected!")} />
          <button
            type="submit"
            className="mt-4 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Complete Registration
          </button>
        </div>
      </form>
    </div>
  );
}

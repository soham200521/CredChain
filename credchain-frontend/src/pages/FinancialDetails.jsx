import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';

export default function FinancialDetails() {
  const { register, handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Add credit score calculation logic
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Financial Details</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <InputField label="Monthly Income (INR)" name="income" type="number" register={register} required />
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Monthly Dues</h3>
          {/* Dynamic dues fields would go here */}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <InputField label="Employment Duration (years)" name="duration" type="number" register={register} />
          <InputField label="Weekly Work Hours" name="hours" type="number" register={register} />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Calculate Credit Score
        </button>
      </form>
    </div>
  );
}

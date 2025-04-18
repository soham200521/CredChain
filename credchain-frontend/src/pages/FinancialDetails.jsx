import { useState } from 'react';
import { useForm } from 'react-hook-form';

const currencyOptions = [
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "Pound Sterling", symbol: "£" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  // ...add more as needed
];

export default function FinancialDetails() {
  const { register, handleSubmit, reset } = useForm();
  const [dues, setDues] = useState([
    { title: '', dueDate: '', amount: '', organization: '', currency: 'INR', isLate: false, daysLate: 0 }
  ]);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleDuesChange = (index, event) => {
    const { name, value, type, checked } = event.target;
    const newDues = [...dues];
    newDues[index][name] = type === "checkbox" ? checked : value;
    setDues(newDues);
  };

  const addDues = () => {
    setDues([
      ...dues,
      { title: '', dueDate: '', amount: '', organization: '', currency: 'INR', isLate: false, daysLate: 0 }
    ]);
  };

  const removeDues = (index) => {
    const newDues = [...dues];
    newDues.splice(index, 1);
    setDues(newDues);
  };

  const onSubmit = (data) => {
    const formData = { ...data, dues, rating };
    // Replace this with your backend call or navigation
    console.log("Submit to backend:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    reset();
    setDues([{ title: '', dueDate: '', amount: '', organization: '', currency: 'INR', isLate: false, daysLate: 0 }]);
    setRating(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 w-full max-w-2xl">
        {/* Success Toast */}
        {submitted && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-100 text-green-700 px-6 py-2 rounded-xl shadow-lg font-semibold animate-fade-in z-10">
            Details submitted!
          </div>
        )}

        <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow">
          Financial Details
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Monthly Income */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Income (INR)
            </label>
            <input
              {...register("income", { required: true })}
              type="number"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
              placeholder="Enter monthly income"
            />
          </div>

          {/* Monthly Dues */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-800">Monthly Dues</h3>
              <span className="text-gray-400 text-sm">(Add your monthly obligations)</span>
            </div>
            <div className="space-y-4">
              {dues.length === 0 && (
                <div className="border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400 text-center py-6">
                  Add your monthly dues here
                </div>
              )}
              {dues.map((due, index) => (
                <div key={index} className="p-4 bg-white/80 rounded-lg border border-gray-200 space-y-3 shadow transition-all duration-300 hover:shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Due #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeDues(index)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Title (Name of Due)
                      </label>
                      <input
                        name="title"
                        value={due.title}
                        onChange={e => handleDuesChange(index, e)}
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        placeholder="e.g., Rent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <div className="relative">
                        <input
                          name="dueDate"
                          type="date"
                          value={due.dueDate}
                          onChange={e => handleDuesChange(index, e)}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <input
                        name="amount"
                        type="number"
                        value={due.amount}
                        onChange={e => handleDuesChange(index, e)}
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        name="currency"
                        value={due.currency}
                        onChange={e => handleDuesChange(index, e)}
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                      >
                        {currencyOptions.map(opt => (
                          <option key={opt.code} value={opt.code}>
                            {opt.symbol} {opt.code} - {opt.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Due to (Organization)
                      </label>
                      <input
                        name="organization"
                        value={due.organization}
                        onChange={e => handleDuesChange(index, e)}
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        placeholder="e.g., Bank, Landlord"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-4 pt-2">
                      <input
                        type="checkbox"
                        id={`isLate-${index}`}
                        name="isLate"
                        checked={due.isLate}
                        onChange={e => handleDuesChange(index, e)}
                        className="h-4 w-4 text-purple-600 rounded"
                      />
                      <label htmlFor={`isLate-${index}`} className="text-xs font-medium text-gray-700">
                        This payment is late
                      </label>
                      {due.isLate && (
                        <input
                          type="number"
                          name="daysLate"
                          value={due.daysLate}
                          onChange={e => handleDuesChange(index, e)}
                          className="ml-4 w-32 rounded border border-gray-300 px-3 py-2 text-sm"
                          placeholder="Days late"
                          min="1"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addDues}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition"
              >
                + Add Due
              </button>
            </div>
          </div>

          {/* Ratings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ratings (on app you work on)
            </label>
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} transition-all`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.953 4.146.018c.958.004 1.355 1.226.584 1.818l-3.36 2.455 1.287 3.951c.3.922-.756 1.688-1.541 1.125L10 13.011l-3.353 2.333c-.785.563-1.841-.203-1.541-1.125l1.287-3.951-3.36-2.455c-.77-.592-.374-1.814.584-1.818l4.146-.018 1.286-3.953z" />
                    </svg>
                  </button>
                ))}
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-700">{rating} / 5</span>
            </div>
          </div>

          {/* Duration and Work Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration with Current Company (years)
              </label>
              <input
                {...register("duration")}
                type="number"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                placeholder="Enter employment duration"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Work Hours
              </label>
              <input
                {...register("hours")}
                type="number"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                placeholder="Enter weekly hours"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg"
          >
            Submit Financial Details
          </button>
        </form>
      </div>
    </div>
  );
}

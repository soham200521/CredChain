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
];

export default function FinancialDetails() {
  const { register, handleSubmit, reset, formState: { errors }, setError } = useForm();
  const [dues, setDues] = useState([
    { title: '', dueDate: '', amount: '', organization: '', currency: 'INR', isLate: false, daysLate: 0 }
  ]);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [duesErrors, setDuesErrors] = useState([]);

  // Validate all dues fields before submit
  const validateDues = () => {
    let valid = true;
    let errorsArr = [];
    dues.forEach((due, idx) => {
      let dueErr = {};
      if (!due.title) { dueErr.title = true; valid = false; }
      if (!due.dueDate) { dueErr.dueDate = true; valid = false; }
      if (!due.amount) { dueErr.amount = true; valid = false; }
      if (!due.organization) { dueErr.organization = true; valid = false; }
      if (!due.currency) { dueErr.currency = true; valid = false; }
      if (due.isLate && (!due.daysLate || parseInt(due.daysLate) < 1)) { dueErr.daysLate = true; valid = false; }
      errorsArr[idx] = dueErr;
    });
    setDuesErrors(errorsArr);
    return valid;
  };

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

  const validateFileType = (file, types) => {
    if (!file) return false;
    const valid = types.some(type =>
      file.type === type || (type === 'image/jpeg' && file.name.match(/\.(jpg|jpeg)$/i))
    );
    return valid;
  };

  const onSubmit = (data) => {
    if (!validateDues()) return;
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    // File type validation
    let fileErrors = false;

    if (
      !data.dueCertificates?.[0] ||
      data.dueCertificates[0].type !== "application/pdf"
    ) {
      setError("dueCertificates", { type: "manual", message: "Please upload a PDF file." });
      fileErrors = true;
    }
    if (
      !data.ratingsImage?.[0] ||
      !(data.ratingsImage[0].type === "image/jpeg" || data.ratingsImage[0].name.match(/\.(jpg|jpeg)$/i))
    ) {
      setError("ratingsImage", { type: "manual", message: "Please upload a JPG image." });
      fileErrors = true;
    }
    if (
      !data.joiningCertificate?.[0] ||
      data.joiningCertificate[0].type !== "application/pdf"
    ) {
      setError("joiningCertificate", { type: "manual", message: "Please upload a PDF file." });
      fileErrors = true;
    }
    if (
      !data.weeklyWorkHoursPdf?.[0] ||
      data.weeklyWorkHoursPdf[0].type !== "application/pdf"
    ) {
      setError("weeklyWorkHoursPdf", { type: "manual", message: "Please upload a PDF file." });
      fileErrors = true;
    }
    if (
      !data.bankStatement?.[0] ||
      data.bankStatement[0].type !== "application/pdf"
    ) {
      setError("bankStatement", { type: "manual", message: "Please upload a PDF file." });
      fileErrors = true;
    }

    if (fileErrors) return;

    const formData = { ...data, dues, rating };
    console.log("Submit to backend:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    reset();
    setDues([{ title: '', dueDate: '', amount: '', organization: '', currency: 'INR', isLate: false, daysLate: 0 }]);
    setRating(0);
    setDuesErrors([]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e]">
      <div className="relative bg-white/15 backdrop-blur-lg rounded-3xl shadow-[0_0_40px_#4f8cfb40] p-10 w-full max-w-2xl border border-[#4f8cfb]/30">
        {/* Success Toast */}
        {submitted && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-300/90 text-green-900 px-6 py-2 rounded-xl shadow-lg font-semibold animate-fade-in z-10">
            Details submitted!
          </div>
        )}

        <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] drop-shadow">
          Financial Details
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Monthly Income */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Monthly Income (INR)
            </label>
            <input
              {...register("income", { required: "Monthly income is required" })}
              type="number"
              className={`w-full rounded-lg border px-4 py-3 bg-white/20 text-white placeholder-[#b8cfff] focus:ring-2 focus:ring-[#a770ef] focus:border-[#a770ef] transition ${errors.income ? "border-red-500" : "border-[#4f8cfb]/40"}`}
              placeholder="Enter monthly income"
            />
            {errors.income && <p className="text-red-400 text-xs mt-1">{errors.income.message}</p>}
          </div>
          {/* Monthly Dues */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-[#4f8cfb]">Monthly Dues</h3>
              <span className="text-[#b8cfff] text-sm">(Add your monthly obligations)</span>
            </div>
            <div className="space-y-4">
              {dues.length === 0 && (
                <div className="border border-dashed border-[#4f8cfb]/30 rounded-lg bg-white/10 text-[#b8cfff] text-center py-6">
                  Add your monthly dues here
                </div>
              )}
              {dues.map((due, index) => (
                <div key={index} className="p-4 bg-white/10 rounded-lg border border-[#a770ef]/20 space-y-3 shadow transition-all duration-300 hover:shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">Due #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeDues(index)}
                      className="text-red-400 hover:text-red-600 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-white mb-1">
                        Title (Name of Due)
                      </label>
                      <input
                        name="title"
                        value={due.title}
                        onChange={e => handleDuesChange(index, e)}
                        required
                        className={`w-full rounded border px-3 py-2 text-sm bg-white/20 text-white placeholder-[#b8cfff] ${duesErrors[index]?.title ? "border-red-500" : "border-[#4f8cfb]/30"}`}
                        placeholder="e.g., Rent"
                      />
                      {duesErrors[index]?.title && <p className="text-red-400 text-xs mt-1">Required</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white mb-1">
                        Due Date
                      </label>
                      <div className="relative">
                        <input
                          name="dueDate"
                          type="date"
                          value={due.dueDate}
                          onChange={e => handleDuesChange(index, e)}
                          required
                          className={`w-full rounded border px-3 py-2 text-sm pr-10 bg-white/20 text-white placeholder-[#b8cfff] ${duesErrors[index]?.dueDate ? "border-red-500" : "border-[#4f8cfb]/30"}`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b8cfff] pointer-events-none">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </span>
                      </div>
                      {duesErrors[index]?.dueDate && <p className="text-red-400 text-xs mt-1">Required</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white mb-1">
                        Amount
                      </label>
                      <input
                        name="amount"
                        type="number"
                        value={due.amount}
                        onChange={e => handleDuesChange(index, e)}
                        required
                        className={`w-full rounded border px-3 py-2 text-sm bg-white/20 text-white placeholder-[#b8cfff] ${duesErrors[index]?.amount ? "border-red-500" : "border-[#4f8cfb]/30"}`}
                        placeholder="0.00"
                      />
                      {duesErrors[index]?.amount && <p className="text-red-400 text-xs mt-1">Required</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white mb-1">
                        Currency
                      </label>
                      <select
                        name="currency"
                        value={due.currency}
                        onChange={e => handleDuesChange(index, e)}
                        required
                        className={`w-full rounded border px-3 py-2 text-sm bg-white/20 text-white ${duesErrors[index]?.currency ? "border-red-500" : "border-[#4f8cfb]/30"}`}
                      >
                        {currencyOptions.map(opt => (
                          <option key={opt.code} value={opt.code}>
                            {opt.symbol} {opt.code} - {opt.name}
                          </option>
                        ))}
                      </select>
                      {duesErrors[index]?.currency && <p className="text-red-400 text-xs mt-1">Required</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-white mb-1">
                        Due to (Organization)
                      </label>
                      <input
                        name="organization"
                        value={due.organization}
                        onChange={e => handleDuesChange(index, e)}
                        required
                        className={`w-full rounded border px-3 py-2 text-sm bg-white/20 text-white placeholder-[#b8cfff] ${duesErrors[index]?.organization ? "border-red-500" : "border-[#4f8cfb]/30"}`}
                        placeholder="e.g., Bank, Landlord"
                      />
                      {duesErrors[index]?.organization && <p className="text-red-400 text-xs mt-1">Required</p>}
                    </div>
                    <div className="md:col-span-2 flex items-center gap-4 pt-2">
                      <input
                        type="checkbox"
                        id={`isLate-${index}`}
                        name="isLate"
                        checked={due.isLate}
                        onChange={e => handleDuesChange(index, e)}
                        className="h-4 w-4 text-[#a770ef] rounded"
                      />
                      <label htmlFor={`isLate-${index}`} className="text-xs font-medium text-white">
                        This payment is late
                      </label>
                      {due.isLate && (
                        <>
                          <input
                            type="number"
                            name="daysLate"
                            value={due.daysLate}
                            onChange={e => handleDuesChange(index, e)}
                            required
                            className={`ml-4 w-32 rounded border px-3 py-2 text-sm bg-white/20 text-white placeholder-[#b8cfff] ${duesErrors[index]?.daysLate ? "border-red-500" : "border-[#4f8cfb]/30"}`}
                            placeholder="Days late"
                            min="1"
                          />
                          {duesErrors[index]?.daysLate && <p className="text-red-400 text-xs mt-1">Required</p>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addDues}
                className="w-full bg-gradient-to-r from-[#a770ef] to-[#4f8cfb] text-white py-2 rounded-lg font-semibold hover:from-[#a770ef] hover:to-[#4f8cfb] transition"
              >
                + Add Due
              </button>
            </div>
          </div>
          {/* Ratings */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Ratings (on app you work on) <span className="text-red-400">*</span>
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
                      className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-[#4f8cfb]/40'} transition-all`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.953 4.146.018c.958.004 1.355 1.226.584 1.818l-3.36 2.455 1.287 3.951c.3.922-.756 1.688-1.541 1.125L10 13.011l-3.353 2.333c-.785.563-1.841-.203-1.541-1.125l1.287-3.951-3.36-2.455c-.77-.592-.374-1.814.584-1.818l4.146-.018 1.286-3.953z" />
                    </svg>
                  </button>
                ))}
              </div>
              <span className="ml-2 text-lg font-semibold text-white">{rating} / 5</span>
            </div>
            {rating === 0 && <p className="text-red-400 text-xs mt-1">Rating is required</p>}
          </div>
          {/* Duration and Work Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Duration with Current Company (years)
              </label>
              <input
                {...register("duration", { required: "Duration is required" })}
                type="number"
                className={`w-full rounded-lg border px-4 py-3 bg-white/20 text-white placeholder-[#b8cfff] focus:ring-2 focus:ring-[#a770ef] focus:border-[#a770ef] ${errors.duration ? "border-red-500" : "border-[#4f8cfb]/40"}`}
                placeholder="Enter employment duration"
              />
              {errors.duration && <p className="text-red-400 text-xs mt-1">{errors.duration.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Weekly Work Hours
              </label>
              <input
                {...register("hours", { required: "Weekly work hours are required" })}
                type="number"
                className={`w-full rounded-lg border px-4 py-3 bg-white/20 text-white placeholder-[#b8cfff] focus:ring-2 focus:ring-[#a770ef] focus:border-[#a770ef] ${errors.hours ? "border-red-500" : "border-[#4f8cfb]/40"}`}
                placeholder="Enter weekly hours"
              />
              {errors.hours && <p className="text-red-400 text-xs mt-1">{errors.hours.message}</p>}
            </div>
          </div>
          {/* Document Uploads */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Upload Documents</h3>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Due Certificates (PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                {...register('dueCertificates', { required: "Due certificates PDF is required" })}
                className={`w-full rounded border px-3 py-2 bg-white/20 text-white placeholder-[#b8cfff] ${errors.dueCertificates ? "border-red-500" : "border-[#4f8cfb]/30"}`}
              />
              {errors.dueCertificates && <p className="text-red-400 text-xs mt-1">{errors.dueCertificates.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Image of Ratings (Screenshot in JPG)</label>
              <input
                type="file"
                accept=".jpg, .jpeg,image/jpeg"
                {...register('ratingsImage', { required: "Ratings screenshot (JPG) is required" })}
                className={`w-full rounded border px-3 py-2 bg-white/20 text-white placeholder-[#b8cfff] ${errors.ratingsImage ? "border-red-500" : "border-[#4f8cfb]/30"}`}
              />
              {errors.ratingsImage && <p className="text-red-400 text-xs mt-1">{errors.ratingsImage.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Joining Certificate (PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                {...register('joiningCertificate', { required: "Joining certificate PDF is required" })}
                className={`w-full rounded border px-3 py-2 bg-white/20 text-white placeholder-[#b8cfff] ${errors.joiningCertificate ? "border-red-500" : "border-[#4f8cfb]/30"}`}
              />
              {errors.joiningCertificate && <p className="text-red-400 text-xs mt-1">{errors.joiningCertificate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Weekly Work Hours (Past Work Done PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                {...register('weeklyWorkHoursPdf', { required: "Work hours PDF is required" })}
                className={`w-full rounded border px-3 py-2 bg-white/20 text-white placeholder-[#b8cfff] ${errors.weeklyWorkHoursPdf ? "border-red-500" : "border-[#4f8cfb]/30"}`}
              />
              {errors.weeklyWorkHoursPdf && <p className="text-red-400 text-xs mt-1">{errors.weeklyWorkHoursPdf.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Bank Statement (Past 3 months PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                {...register('bankStatement', { required: "Bank statement PDF is required" })}
                className={`w-full rounded border px-3 py-2 bg-white/20 text-white placeholder-[#b8cfff] ${errors.bankStatement ? "border-red-500" : "border-[#4f8cfb]/30"}`}
              />
              {errors.bankStatement && <p className="text-red-400 text-xs mt-1">{errors.bankStatement.message}</p>}
            </div>
          </div>
          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] text-white px-8 py-4 rounded-lg shadow-lg hover:from-[#a770ef] hover:to-[#4f8cfb] transition-all font-semibold text-lg"
          >
            Submit Financial Details
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
export default function FinancialDetails() {
  const [form, setForm] = useState({
    income: '',
    duration: '',
    hours: '',
    dueCertificates: null,
    ratingsImage: null,
    joiningCertificate: null,
    weeklyWorkHoursPdf: null,
    bankStatement: null,
  });
  const navigate=useNavigate()
  const [formErrors, setFormErrors] = useState({});
  const [dues, setDues] = useState([
    { title: '', dueDate: '', amount: '', organization: '', isLate: false, daysLate: '' }
  ]);
  const [duesErrors, setDuesErrors] = useState([]);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'file' ? files[0] : value
    }));
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
      { title: '', dueDate: '', amount: '', organization: '', isLate: false, daysLate: '' }
    ]);
  };

  const removeDues = (index) => {
    const newDues = [...dues];
    newDues.splice(index, 1);
    setDues(newDues);
  };

  const validateDues = () => {
    let valid = true;
    let errorsArr = [];
    dues.forEach((due, idx) => {
      let dueErr = {};
      if (!due.title) { dueErr.title = true; valid = false; }
      if (!due.dueDate) { dueErr.dueDate = true; valid = false; }
      if (due.amount === '' || isNaN(Number(due.amount))) { dueErr.amount = true; valid = false; }
      if (Number(due.amount) < 0) { dueErr.amountNegative = true; valid = false; }
      if (!due.organization) { dueErr.organization = true; valid = false; }
      if (due.isLate && (!due.daysLate || Number(due.daysLate) < 1)) { dueErr.daysLate = true; valid = false; }
      errorsArr[idx] = dueErr;
    });
    setDuesErrors(errorsArr);
    return valid;
  };

  const validateFileType = (file, types) => {
    if (!file) return false;
    return types.some(type =>
      file.type === type || (type === 'image/jpeg' && file.name.match(/\.(jpg|jpeg)$/i))
    );
  };

  const validateForm = () => {
    let errors = {};
    if (form.income === '') errors.income = "Monthly income is required";
    else if (Number(form.income) < 0) errors.income = "Monthly income cannot be negative";
    if (form.duration === '') errors.duration = "Duration is required";
    else if (Number(form.duration) < 0) errors.duration = "Duration cannot be negative";
    if (form.hours === '') errors.hours = "Weekly work hours are required";
    else if (Number(form.hours) < 0) errors.hours = "Weekly work hours cannot be negative";
    if (!form.dueCertificates || !validateFileType(form.dueCertificates, ['application/pdf'])) errors.dueCertificates = "Please upload a PDF file.";
    if (!form.ratingsImage || !validateFileType(form.ratingsImage, ['image/jpeg'])) errors.ratingsImage = "Please upload a JPG image.";
    if (!form.joiningCertificate || !validateFileType(form.joiningCertificate, ['application/pdf'])) errors.joiningCertificate = "Please upload a PDF file.";
    if (!form.weeklyWorkHoursPdf || !validateFileType(form.weeklyWorkHoursPdf, ['application/pdf'])) errors.weeklyWorkHoursPdf = "Please upload a PDF file.";
    if (!form.bankStatement || !validateFileType(form.bankStatement, ['application/pdf'])) errors.bankStatement = "Please upload a PDF file.";
    if (rating === 0) errors.rating = "Rating is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Upload all files in one request
  const uploadAllFiles = async () => {
    const formData = new FormData();
    formData.append('dueCertificates', form.dueCertificates);
    formData.append('ratingsImage', form.ratingsImage);
    formData.append('joiningCertificate', form.joiningCertificate);
    formData.append('weeklyWorkHoursPdf', form.weeklyWorkHoursPdf);
    formData.append('bankStatement', form.bankStatement);

    const response = await axios.post('/upload-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const duesValid = validateDues();
    const formValid = validateForm();
    if (!duesValid || !formValid) return;
  
    try {
      // 1. Upload files
      const formData = new FormData();
      formData.append('dueCertificates', form.dueCertificates);
      formData.append('ratingsImage', form.ratingsImage);
      formData.append('joiningCertificate', form.joiningCertificate);
      formData.append('weeklyWorkHoursPdf', form.weeklyWorkHoursPdf);
      formData.append('bankStatement', form.bankStatement);
  
      const uploadResponse = await axios.post('/upload-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      // 2. Submit form data
      const submission = {
        monthlyIncome: Number(form.income),
        duration: Number(form.duration),
        hours: Number(form.hours),
        rating,
        dues: dues.map(due => ({
          title: due.title,
          dueDate: due.dueDate,
          amount: Number(due.amount),
          organization: due.organization,
          isLate: due.isLate,
          daysLate: due.isLate ? Number(due.daysLate) : 0
        })),
        documents: uploadResponse.data.urls
      };
  
      await axios.post('/submitdetails', submission);
  
      // Reset form state
      setForm({
        income: '',
        duration: '',
        hours: '',
        dueCertificates: null,
        ratingsImage: null,
        joiningCertificate: null,
        weeklyWorkHoursPdf: null,
        bankStatement: null,
      });
      setDues([{ 
        title: '', 
        dueDate: '', 
        amount: '', 
        organization: '', 
        isLate: false, 
        daysLate: '' 
      }]);
      setRating(0);
      setDuesErrors([]);
      setFormErrors({});
      
      // Show success alert
      window.alert('Form submitted successfully! Your Documents will be verified and Score updated within 5 days');
      navigate('/')
  
    } catch (error) {
      console.error('Submission error:', error.response?.data);
      alert(`Error: ${error.response?.data?.message || 'Submission failed'}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e]">
      <div className="relative bg-white/15 backdrop-blur-lg rounded-3xl shadow-[0_0_40px_#4f8cfb40] p-10 w-full max-w-2xl border border-[#4f8cfb]/30">
        {submitted && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-300/90 text-green-900 px-6 py-2 rounded-xl shadow-lg font-semibold animate-fade-in z-10">
            Details submitted!
          </div>
        )}
        <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] drop-shadow">
          Financial Details
        </h1>
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Monthly Income */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Monthly Income (INR)
            </label>
            <input
              name="income"
              type="number"
              value={form.income}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 bg-white/20 text-white placeholder-[#b8cfff] ${formErrors.income ? "border-red-500" : "border-[#4f8cfb]/40"}`}
              placeholder="Enter monthly income"
            />
            {formErrors.income && <p className="text-red-400 text-xs mt-1">{formErrors.income}</p>}
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
                      <input
                        name="dueDate"
                        type="date"
                        value={due.dueDate}
                        onChange={e => handleDuesChange(index, e)}
                        required
                        className={`w-full rounded border px-3 py-2 text-sm pr-10 bg-white/20 text-white placeholder-[#b8cfff] ${duesErrors[index]?.dueDate ? "border-red-500" : "border-[#4f8cfb]/30"}`}
                      />
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
                        min="0"
                        className={`w-full rounded border px-3 py-2 text-sm bg-white/20 text-white placeholder-[#b8cfff] ${duesErrors[index]?.amount || duesErrors[index]?.amountNegative ? "border-red-500" : "border-[#4f8cfb]/30"}`}
                        placeholder="0.00"
                      />
                      {duesErrors[index]?.amount && <p className="text-red-400 text-xs mt-1">Required</p>}
                      {duesErrors[index]?.amountNegative && <p className="text-red-400 text-xs mt-1">Amount cannot be negative</p>}
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
                            min="1"
                            className={`ml-4 w-32 rounded border px-3 py-2 text-sm bg-white/20 text-white placeholder-[#b8cfff] ${duesErrors[index]?.daysLate ? "border-red-500" : "border-[#4f8cfb]/30"}`}
                            placeholder="Days late"
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
            {formErrors.rating && <p className="text-red-400 text-xs mt-1">{formErrors.rating}</p>}
          </div>
          {/* Duration and Work Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Duration with Current Company (years)
              </label>
              <input
                name="duration"
                type="number"
                value={form.duration}
                onChange={handleChange}
                min="0"
                required
                className={`w-full rounded-lg border px-4 py-3 bg-white/20 text-white placeholder-[#b8cfff] ${formErrors.duration ? "border-red-500" : "border-[#4f8cfb]/40"}`}
                placeholder="Enter employment duration"
              />
              {formErrors.duration && <p className="text-red-400 text-xs mt-1">{formErrors.duration}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Weekly Work Hours
              </label>
              <input
                name="hours"
                type="number"
                value={form.hours}
                onChange={handleChange}
                min="0"
                required
                className={`w-full rounded-lg border px-4 py-3 bg-white/20 text-white placeholder-[#b8cfff] ${formErrors.hours ? "border-red-500" : "border-[#4f8cfb]/40"}`}
                placeholder="Enter weekly hours"
              />
              {formErrors.hours && <p className="text-red-400 text-xs mt-1">{formErrors.hours}</p>}
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
                name="dueCertificates"
                onChange={handleChange}
                required
                className={`w-full rounded border px-3 py-2 bg-white/20 text-white placeholder-[#b8cfff] ${formErrors.dueCertificates ? "border-red-500" : "border-[#4f8cfb]/30"}`}
              />
              {formErrors.dueCertificates && <p className="text-red-400 text-xs mt-1">{formErrors.dueCertificates}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Image of Ratings (Screenshot in JPG)</label>
              <input
                type="file"
                accept=".jpg, .jpeg,image/jpeg"
                name="ratingsImage"
                onChange={handleChange}
                required
                className={`w-full rounded border px-3 py-2 bg-white/20 text-white placeholder-[#b8cfff] ${formErrors.ratingsImage ? "border-red-500" : "border-[#4f8cfb]/30"}`}
              />
              {formErrors.ratingsImage && <p className="text-red-400 text-xs mt-1">{formErrors.ratingsImage}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Joining Certificate (PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                name="joiningCertificate"
                onChange={handleChange}
                required
                className={`w-full rounded border px-3 py-2 bg-white/20 text-white placeholder-[#b8cfff] ${formErrors.joiningCertificate ? "border-red-500" : "border-[#4f8cfb]/30"}`}
              />
              {formErrors.joiningCertificate && <p className="text-red-400 text-xs mt-1">{formErrors.joiningCertificate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Weekly Work Hours (Past Work Done PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                name="weeklyWorkHoursPdf"
                onChange={handleChange}
                required
                className={`w-full rounded border px-3 py-2 bg-white/20 text-white placeholder-[#b8cfff] ${formErrors.weeklyWorkHoursPdf ? "border-red-500" : "border-[#4f8cfb]/30"}`}
              />
              {formErrors.weeklyWorkHoursPdf && <p className="text-red-400 text-xs mt-1">{formErrors.weeklyWorkHoursPdf}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Bank Statement (Past 3 months PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                name="bankStatement"
                onChange={handleChange}
                required
                className={`w-full rounded border px-3 py-2 bg-white/20 text-white placeholder-[#b8cfff] ${formErrors.bankStatement ? "border-red-500" : "border-[#4f8cfb]/30"}`}
              />
              {formErrors.bankStatement && <p className="text-red-400 text-xs mt-1">{formErrors.bankStatement}</p>}
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

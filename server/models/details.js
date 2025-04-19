// models/Details.js
const mongoose = require('mongoose');

const detailsSchema = new mongoose.Schema({
    monthlyIncome: { type: Number, required: true }, // Changed from "income"
    dues: [{
      title: { type: String, required: true },
      dueDate: { type: Date, required: true },
      amount: { type: Number, required: true },
      organization: { type: String, required: true }, // Changed from "DueTo"
      isLate: { type: Boolean, required: true },
      daysLate: { type: Number, default: 0 }
    }],
    rating: { type: Number, required: true, min: 0, max: 5 },
    duration: { type: Number, required: true }, // Changed from "workDuration"
    hours: { type: Number, required: true }, // Changed from "weeklyHrs"
    documents: {
      dueCertificates: String,
      ratingsImage: String,
      joiningCertificate: String,
      weeklyWorkHoursPdf: String,
      bankStatement: String
    },
    verified:{
      type:String,
      require:true,
      default:"non",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }
  });

module.exports = mongoose.model("detail", detailsSchema);

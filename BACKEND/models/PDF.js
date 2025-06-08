const mongoose = require("mongoose");

const PdfDocumentSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  subject: { type: String, required: true, trim: true },
  professor: { type: String, required: true, trim: true },
  unitNumber: { type: Number, required: true },
  gridFsFileId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ✅ MUST have this!
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PdfDocument", PdfDocumentSchema);

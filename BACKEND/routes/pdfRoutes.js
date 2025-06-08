const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const PdfDocument = require("../models/PDF");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// MongoDB connection and GridFS initialization
let gridBucket;
mongoose.connection.once("open", () => {
  gridBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: "pdfs"
  });
});

// Use multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload PDF
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    // Extract metadata from request body
    const { year, subject, professor, unitNumber } = req.body;

    // Check if file is provided and is a PDF
    if (!req.file || req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }

    // Check if all metadata fields are provided
    if (!year || !subject || !professor || !unitNumber) {
      return res.status(400).json({ message: "All metadata fields are required" });
    }

    // Upload PDF to GridFS
    const writeStream = gridBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    // Write the PDF buffer to GridFS
    writeStream.end(req.file.buffer);

    // Once upload is finished, save the metadata in PdfDocument collection
    writeStream.on("finish", async () => {
      const newDoc = new PdfDocument({
        year,
        subject,
        professor,
        unitNumber,
        gridFsFileId: writeStream.id, // Save the GridFS file ID
        uploadedBy: req.user.id, // Assume req.user contains the authenticated user
      });

      await newDoc.save(); // Save to the PdfDocument collection

      res.status(201).json({
        message: "File uploaded and metadata saved successfully",
        fileId: newDoc._id, // Send the file's document ID back in response
      });
    });

    // Handle upload stream errors
    writeStream.on("error", (err) => {
      console.error("GridFS Error:", err);
      res.status(500).json({ message: "Error uploading PDF" });
    });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/download/:id", async (req, res) => {
  try {
    // Fetch the PDF document from the database using the ID from the URL
    const pdf = await PdfDocument.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    // Open a download stream from GridFS using the file's gridFsFileId
    const downloadStream = gridBucket.openDownloadStream(pdf.gridFsFileId);

    // Set headers for file download
    res.set("Content-Type", "application/pdf");
    res.set("Content-Disposition", `attachment; filename=${pdf.subject}-unit${pdf.unitNumber}.pdf`);

    // Pipe the download stream to the response
    downloadStream.pipe(res);

    // Handle errors that might occur during streaming
    downloadStream.on('error', (err) => {
      console.error('Download Stream Error:', err);
      res.status(500).json({ message: 'Error streaming the PDF file' });
    });

  } catch (err) {
    console.error("Download Error:", err);
    res.status(500).json({ message: "Error downloading PDF" });
  }
});

// ✅ Search PDFs by metadata
router.get("/search-pdfs", async (req, res) => {
  const { year, subject, professor } = req.query;

  try {
    const query = {};
    if (year) query.year = year;
    if (subject) query.subject = new RegExp(subject, 'i'); // Case-insensitive search
    if (professor) query.professor = new RegExp(professor, 'i'); // Case-insensitive search

    const pdfs = await PdfDocument.find(query).populate("uploadedBy", "username");

    if (pdfs.length === 0) {
      return res.status(404).json({ message: "No PDFs found matching the criteria." });
    }

    const results = pdfs.map(pdf => ({
      id: pdf._id,
      subject: pdf.subject,
      year: pdf.year,
      unitNumber: pdf.unitNumber,
      professor: pdf.professor,
      fileUrl: `/api/pdf/download/${pdf._id}`,
      uploadedAt: pdf.uploadedAt,
      uploadedBy: pdf.uploadedBy?.username || "Unknown"
    }));

    res.json({ pdfs: results });
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ message: "Failed to fetch PDFs" });
  }
});

// ✅ Count Route (for Dashboard)
router.get("/count", authMiddleware, async (req, res) => {
  try {
    // Get total count of PDFs
    const totalPdfs = await PdfDocument.countDocuments();

    // Respond with a JSON object containing the count
    res.json({
      message: "PDF count fetched successfully",
      count: totalPdfs,  // Return the total count of PDFs
    });
  } catch (err) {
    console.error("Error fetching PDF count:", err);
    res.status(500).json({ message: "Error fetching PDF count" });
  }
});

module.exports = router;

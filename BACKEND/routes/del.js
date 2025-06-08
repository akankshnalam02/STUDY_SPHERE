require('dotenv').config(); // Load environment variables

const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

// ✅ Load your MONGO_URI from .env
const mongoURI = "mongodb+srv://hari:racer@cluster0.wxw6a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
if (!mongoURI) {
    console.error("❌ MongoDB URI is undefined. Add MONGO_URI to your .env file.");
    process.exit(1);
}

// ✅ Define your PdfDocument model
const PdfDocumentSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    subject: { type: String, required: true },
    professor: { type: String, required: true },
    unitNumber: { type: Number, required: true },
    gridFsFileId: { type: mongoose.Schema.Types.ObjectId, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uploadedAt: { type: Date, default: Date.now },
});
const PdfDocument = mongoose.model("PdfDocument", PdfDocumentSchema);

// ✅ Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log("✅ MongoDB connected!");
}).catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
});

// ✅ Initialize GridFS once connected
mongoose.connection.once('open', async () => {
    const db = mongoose.connection.db;
    const gridBucket = new GridFSBucket(db, { bucketName: 'pdfs' });

    try {
        const allPdfs = await PdfDocument.find({});
        console.log(`📄 Found ${allPdfs.length} PdfDocument(s)`);

        for (let pdf of allPdfs) {
            const fileId = pdf.gridFsFileId;
            if (fileId) {
                try {
                    await gridBucket.delete(fileId);
                    console.log(`🗑️ Deleted GridFS file: ${fileId}`);
                } catch (err) {
                    console.error(`⚠️ Could not delete file ${fileId}:`, err.message);
                }
            } else {
                console.warn(`⚠️ No gridFsFileId for document ${pdf._id}`);
            }
        }

        await PdfDocument.deleteMany({});
        console.log("✅ All PdfDocument entries deleted.");
        process.exit(0);

    } catch (err) {
        console.error("❌ Error deleting files/documents:", err);
        process.exit(1);
    }
});

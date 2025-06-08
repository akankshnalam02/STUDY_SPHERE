import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [uploadType, setUploadType] = useState("pdf"); // "pdf" or "timetable"
  const [formData, setFormData] = useState({
    year: "",
    teacher: "",
    section: "",
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      alert("Please select a file to upload.");
      return;
    }

    const data = new FormData();
    data.append("year", formData.year);
    data.append("teacher", formData.teacher);
    data.append("section", formData.section);
    data.append("file", formData.file);

    try {
      const endpoint = uploadType === "pdf" ? "/upload_pdf" : "/upload_timetable";
      const response = await axios.post(`http://127.0.0.1:5000${endpoint}`, data);
      alert(response.data.message);
      setFormData({ year: "", teacher: "", section: "", file: null });
    } catch (error) {
      console.error(error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="md" className="admin-dashboard-container">
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>
      
      {/* Mode Toggle */}
      <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: "20px" }}>
        <Grid item>
          <Button
            variant={uploadType === "pdf" ? "contained" : "outlined"}
            onClick={() => setUploadType("pdf")}
            className="mode-btn"
          >
            Upload PDF
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={uploadType === "timetable" ? "contained" : "outlined"}
            onClick={() => setUploadType("timetable")}
            className="mode-btn"
          >
            Upload Timetable
          </Button>
        </Grid>
      </Grid>
      
      <Card className="upload-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {uploadType === "pdf" ? "Upload PDF File" : "Upload Timetable"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel id="year-label">Year</InputLabel>
                  <Select
                    labelId="year-label"
                    name="year"
                    value={formData.year}
                    label="Year"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">
                      <em>Select Year</em>
                    </MenuItem>
                    <MenuItem value="1">1st Year</MenuItem>
                    <MenuItem value="2">2nd Year</MenuItem>
                    <MenuItem value="3">3rd Year</MenuItem>
                    <MenuItem value="4">4th Year</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Teacher"
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Section"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label">
                  Select File
                  <input type="file" hidden onChange={handleFileChange} accept="application/pdf" />
                </Button>
                {formData.file && (
                  <Typography variant="body2" className="file-name">
                    {formData.file.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </form>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} className="submit-btn">
            Submit
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default AdminDashboard;

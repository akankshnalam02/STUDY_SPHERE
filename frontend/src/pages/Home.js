import React, { useState } from "react";
import {
  Container,
  Button,
  Select,
  MenuItem,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import axios from "axios";

export default function Home() {
  const [mode, setMode] = useState("pdf");
  const [year, setYear] = useState("");
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    try {
      const url = mode === "pdf" ? "/get_pdf" : "/get_timetable";
      const data = mode === "pdf" ? { year, subject, teacher } : { year, branch, section };

      const response = await axios.post(`http://127.0.0.1:5000${url}`, data);
      setResult(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResult("Error retrieving data. Please try again.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" sx={{ marginTop: 3 }}>
        Study Sphere - Access
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 2 }}>
        <Button variant={mode === "pdf" ? "contained" : "outlined"} onClick={() => setMode("pdf")}>
          Get PDF
        </Button>
        <Button variant={mode === "timetable" ? "contained" : "outlined"} onClick={() => setMode("timetable")}>
          Get Timetable
        </Button>
      </Box>

      {/* Form Fields */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 3 }}>
        <Select value={year} onChange={(e) => setYear(e.target.value)} displayEmpty>
          <MenuItem value="" disabled>Year</MenuItem>
          <MenuItem value="1">1st Year</MenuItem>
          <MenuItem value="2">2nd Year</MenuItem>
        </Select>

        {mode === "pdf" ? (
          <>
            <TextField label="Subject" variant="outlined" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <TextField label="Teacher" variant="outlined" value={teacher} onChange={(e) => setTeacher(e.target.value)} />
          </>
        ) : (
          <>
            <TextField label="Branch" variant="outlined" value={branch} onChange={(e) => setBranch(e.target.value)} />
            <TextField label="Section" variant="outlined" value={section} onChange={(e) => setSection(e.target.value)} />
          </>
        )}
      </Box>

      <Button variant="contained" sx={{ marginTop: 3 }} onClick={handleSubmit}>
        Fetch Data
      </Button>

      {result && (
        <Typography variant="h6" sx={{ marginTop: 3 }}>
          Result: {result}
        </Typography>
      )}
    </Container>
  );
}

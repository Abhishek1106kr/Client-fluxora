import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, CircularProgress, Chip } from "@mui/material";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

export default function AssessmentPortal() {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobId, targetRole } = location.state || {}; // Passed from ProjectDetail.jsx
  const { backendUrl } = useContext(AppContext);
  const base = backendUrl || "http://localhost:5002";

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleStartAnalysis = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      // POST request to the controller we just built
      const response = await fetch(`${base}/api/applications/apply`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        credentials: "include",
        body: JSON.stringify({ mongoJobId: jobId })
      });
      
      const data = await response.json();
      if (data.success) {
        setResult(data.data); // Load the AI score and feedback into the UI
        toast.success("Profile analysis and AI Screening complete!");
      } else {
        toast.error(data.message || "Failed to run AI profile screening.");
      }
    } catch (error) {
      console.error("Assessment failed", error);
      toast.error("An error occurred during evaluation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen bg-slate-50 p-6">
      <Card className="max-w-lg w-full shadow-xl rounded-2xl p-4">
        
        {/* Pre-Assessment State */}
        {!loading && !result && (
          <CardContent className="text-center space-y-4">
            <Typography variant="h5" className="font-bold">Role AI Screening</Typography>
            <Typography variant="body1" className="text-slate-600">
              We will now evaluate your profile, resume, and GitHub projects against the requirements for <b>{targetRole}</b>.
            </Typography>
            <Button 
              variant="contained" 
              fullWidth 
              size="large" 
              className="bg-indigo-600 hover:bg-indigo-700 mt-4"
              onClick={handleStartAnalysis}
            >
              Analyze My Profile
            </Button>
          </CardContent>
        )}

        {/* Loading State */}
        {loading && (
          <CardContent className="flex flex-col items-center space-y-4 py-10">
            <CircularProgress size={60} thickness={4} className="text-indigo-600" />
            <Typography variant="h6" className="animate-pulse">Gemini is analyzing your repository history...</Typography>
          </CardContent>
        )}

        {/* Result State */}
        {result && (
          <CardContent className="space-y-6">
            <Box className="text-center">
              <Typography variant="h3" className={`font-bold ${result.aiScore > 75 ? 'text-emerald-500' : 'text-amber-500'}`}>
                {result.aiScore}/100
              </Typography>
              <Typography variant="subtitle1" className="font-semibold text-slate-500">Alignment Score</Typography>
            </Box>

            <Box className="bg-slate-100 p-4 rounded-lg space-y-2">
              <Typography variant="subtitle2" className="font-bold">Technical Strengths Detected:</Typography>
              <ul className="list-disc pl-5 text-sm text-slate-700">
                {(result.aiFeedback?.strengths || []).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </Box>

            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </CardContent>
        )}

      </Card>
    </Box>
  );
}
import React, { useEffect, useState } from "react";
import { Box, Card, Typography, Chip, Stepper, Step, StepLabel, StepContent, Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

// Helper to color-code status chips
const getStatusConfig = (status) => {
  switch (status) {
    case "PENDING": return { color: "default", label: "Not Started" };
    case "PR_OPEN": return { color: "info", label: "PR Opened - Building Tests" };
    case "UNDER_REVIEW": return { color: "warning", label: "Startup Reviewing" };
    case "MERGED": return { color: "success", label: "Milestone Achieved" };
    case "REJECTED": return { color: "error", label: "Changes Requested" };
    default: return { color: "default", label: status };
  }
};

export default function MilestoneTracker({ initialMilestones, socket }) {
  const [milestones, setMilestones] = useState(initialMilestones);

  useEffect(() => {
    if (!socket) return;

    // Listen for live GitHub webhook updates from your backend
    socket.on("milestone_update", (updatedData) => {
      setMilestones((prev) => 
        prev.map((m) => 
          m.prNumber === updatedData.prNumber 
            ? { ...m, status: updatedData.status } 
            : m
        )
      );
    });

    return () => socket.off("milestone_update");
  }, [socket]);

  return (
    <Card className="p-6 shadow-sm border border-slate-200 rounded-xl">
      <Typography variant="h6" className="font-bold mb-6">Development Milestones</Typography>
      
      <Stepper orientation="vertical">
        {milestones.map((step, index) => {
          const config = getStatusConfig(step.status);
          const isCompleted = step.status === "MERGED";
          const isActive = step.status !== "PENDING" && !isCompleted;

          return (
            <Step key={step.id} active={isActive} completed={isCompleted}>
              <StepLabel>
                <Box className="flex justify-between items-center w-full pr-4">
                  <Typography className="font-semibold">{step.title}</Typography>
                  <Chip size="small" label={config.label} color={config.color} className="font-bold" />
                </Box>
              </StepLabel>
              <StepContent>
                <Typography className="text-slate-600 mb-4 mt-2">
                  {step.description}
                </Typography>
                
                {/* Display GitHub PR Link if a PR is attached */}
                {step.prNumber && (
                  <Button 
                    size="small" 
                    variant="outlined" 
                    startIcon={<GitHubIcon />}
                    href={`https://github.com/your-repo/pull/${step.prNumber}`}
                    target="_blank"
                    className="mb-4"
                  >
                    View PR #{step.prNumber}
                  </Button>
                )}

                {/* Show Feedback Box if Rejected */}
                {step.status === "REJECTED" && step.feedback && (
                  <Box className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4 border border-red-200">
                    <span className="font-bold">Required Fixes:</span> {step.feedback}
                  </Box>
                )}
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Card>
  );
}
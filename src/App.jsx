import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Signup from './Signup/Signup';
import Login from './Login/Login';
import StartupLogin from './Login/startupLogin';
import EmailVerification from './Login/emailVerification';
import ResetPassword from './Login/resetPassword';
import LoginSuccess from './Login/login-sucess';
import MainPage from './FirstFourDiv_AfterNavbar/Mainpage';
import OpportunityMe from './FirstFourDiv_AfterNavbar/OpportunityMe';
import CareerResources from './FirstFourDiv_AfterNavbar/CareerResources';
import Dashboard from './pages/Dashboard';
import ViewDetails from './pages/ViewDetails';
import './index.css';

import Layout from './components/Layout';
import TestimonialForm from './pages/TestimonialForm';
import Job from './pages/Job';
import InterviewPreparation from './pages/InterviewPreparation';
import ResumePreparation from './pages/ResumePreparation';
import StartupsPage from './Startups/StartupsPage';
import StartupDetails from './Startups/StartupDetails';
import EventsPage from './pages/Events';
import Projects from './pages/Projects';
import AssessmentPortal from './pages/AssessmentPortal';

// DevLaunch
import Marketplace from './devlaunch/Marketplace';
import MilestoneDetail from './devlaunch/MilestoneDetail';
import StartupDashboard from './pages/StartupDashboard';
import DevDashboard from './devlaunch/DevDashboard';
import ProjectDetail from './devlaunch/ProjectDetail';
function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl"
      />
      <Routes>
        {/* Auth routes (no layout wrapper) */}
        <Route path="/login" element={<Login />} />
        <Route path="/emailVerification" element={<EmailVerification />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/login-success" element={<LoginSuccess />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/startupLogin" element={<StartupLogin />} />

        {/* Platform routes wrapped in Layout */}
        <Route path="/mainpage" element={
          <Layout>
            <MainPage />
          </Layout>
        } />
        <Route path="/add-testimonial" element={
          <Layout>
            <TestimonialForm />
          </Layout>
        } />
        <Route path="/opportunity/:id" element={
          <Layout>
            <OpportunityMe />
          </Layout>
        } />
        <Route path="/resource/:id" element={
          <Layout>
            <CareerResources />
          </Layout>
        } />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/event/:id" element={
          <Layout>
            <ViewDetails />
          </Layout>
        } />
        <Route path="/job" element={
          <Layout>
            <Job />
          </Layout>
        } />
        <Route path="/interviewPreparation" element={
          <Layout>
            <InterviewPreparation />
          </Layout>
        } />
        <Route path="/resumePreparation" element={
          <Layout>
            <ResumePreparation />
          </Layout>
        } />
        <Route path="/startups" element={
          <Layout>
            <StartupsPage />
          </Layout>
        } />
        <Route path="/startups/:id" element={
          <Layout>
            <StartupDetails />
          </Layout>
        } />
        <Route path="/projects" element={
          <Layout>
            <Projects />
          </Layout>
        } />
        <Route path="/events" element={
          <Layout>
            <EventsPage />
          </Layout>
        } />

        {/* DevLaunch routes */}
        <Route path="/devlaunch" element={
          <Layout>
            <Marketplace />
          </Layout>
        } />
        <Route path="/devlaunch/milestone/:id" element={
          <Layout>
            <MilestoneDetail />
          </Layout>
        } />
        <Route path="/startup/dashboard" element={<StartupDashboard />} />
        <Route path="/devlaunch/startup" element={<Navigate to="/startup/dashboard" replace />} />
        <Route path="/devlaunch/dev-dashboard" element={
          <Layout>
            <DevDashboard />
          </Layout>
        } />
        <Route path="/devlaunch/project/:id" element={
          <Layout>
            <ProjectDetail />
          </Layout>
        } />
        <Route path="/assessment-portal" element={
          <Layout>
            <AssessmentPortal />
          </Layout>
        } />

        {/* Fallback redirect */}
        <Route path="/" element={<Navigate to="/mainpage" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

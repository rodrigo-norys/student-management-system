import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MyRoute from './MyRoute';
import Layout from 'components/Layout';

import Home from 'pages/Home';
import Login from 'pages/Auth/Login';
import Register from 'pages/Auth/Register';
import SetupPassword from 'pages/Auth/SetupPassword';
import StudentList from 'pages/Student/StudentList';
import StudentForm from 'pages/Student/StudentForm';
import StudentProfile from 'pages/Student/StudentProfile';
import StaffList from 'pages/Staff/StaffList';
import StaffForm from 'pages/Staff/StaffForm';
import StaffProfile from 'pages/Staff/StaffProfile';
import GuardianList from 'pages/Guardian/GuardianList';
import GuardianForm from 'pages/Guardian/GuardianForm';
import GuardianProfile from 'pages/Guardian/GuardianProfile';
import Photos from 'pages/System/Photos';
import Page404 from 'pages/System/Page404';
import LandingPreview from 'pages/LandingPreview';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPreview />} />
      <Route element={
        <MyRoute isClosed>
          <Layout />
        </MyRoute>
      }>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/register" element={<Register />} />

        <Route path="/students" element={<StudentList />} />
        <Route path="/student/create" element={<StudentForm />} />
        <Route path="/student/:id/edit" element={<StudentForm />} />
        <Route path="/student/:id" element={<StudentProfile />} />

        <Route path="/staff" element={<StaffList />} />
        <Route path="/staff/create" element={<StaffForm />} />
        <Route path="/staff/:id/edit" element={<StaffForm />} />
        <Route path="/staff/:id" element={<StaffProfile />} />

        <Route path="/guardians" element={<GuardianList />} />
        <Route path="/guardian/create" element={<GuardianForm />} />
        <Route path="/guardian/:id/edit" element={<GuardianForm />} />
        <Route path="/guardian/:id" element={<GuardianProfile />} />

        <Route path="/avatar/:userType/:id" element={<Photos />} />

      </Route>
        <Route path="/preview" element={<LandingPreview />} />

      <Route path="/setup-password" element={
        <MyRoute isClosed>
          <SetupPassword />
        </MyRoute>
      } />

      <Route path="/login" element={
        <MyRoute isClosed={false}>
          <Login />
        </MyRoute>
      } />

      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

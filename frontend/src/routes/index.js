import { Routes, Route } from 'react-router-dom';

import MyRoute from './MyRoute';
import ProtectedRoute from './ProtectedRoute';

import Layout from 'components/Layout';

import Home from 'pages/Home';
import LandingPreview from 'pages/LandingPreview';

import Login from 'pages/Auth/Login';
import UserManagement from 'pages/User/UserManagement';
import SetupPassword from 'pages/Auth/SetupPassword';

import StudentForm from 'pages/Student/StudentForm';
import StudentList from 'pages/Student/StudentList';
import StudentProfile from 'pages/Student/StudentProfile';

import StaffForm from 'pages/Staff/StaffForm';
import StaffList from 'pages/Staff/StaffList';
import StaffProfile from 'pages/Staff/StaffProfile';

import GuardianForm from 'pages/Guardian/GuardianForm';
import GuardianList from 'pages/Guardian/GuardianList';
import GuardianProfile from 'pages/Guardian/GuardianProfile';

import Page404 from 'pages/System/Page404';
import Photos from 'pages/System/Photos';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPreview />} />
      <Route
        element={
          <MyRoute isClosed>
            <Layout />
          </MyRoute>
        }
      >
        <Route path="/dashboard" element={<Home />} />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

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
      <Route
        path="/setup-password"
        element={
          <MyRoute isClosed>
            <SetupPassword />
          </MyRoute>
        }
      />
      <Route
        path="/login"
        element={
          <MyRoute isClosed={false}>
            <Login />
          </MyRoute>
        }
      />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

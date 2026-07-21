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

import UnitForm from 'pages/Unit/UnitForm';
import UnitList from 'pages/Unit/UnitList';

import SubjectForm from 'pages/Subject/SubjectForm';
import SubjectList from 'pages/Subject/SubjectList';

import UnitClassForm from 'pages/UnitClass/UnitClassForm';
import UnitClassList from 'pages/UnitClass/UnitClassList';

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

        {/* Espelha as flags do backend: leitura sob manage_record, escrita sob
            manage_account. */}
        <Route
          path="/units"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 3]}>
              <UnitList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/unit/create"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <UnitForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/unit/:id/edit"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <UnitForm />
            </ProtectedRoute>
          }
        />

        {/* Espelha manage_academic no backend: mesma flag para leitura e escrita. */}
        <Route
          path="/subjects"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 4, 5]}>
              <SubjectList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject/create"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 4, 5]}>
              <SubjectForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject/:id/edit"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 4, 5]}>
              <SubjectForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/unit-classes"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 4, 5]}>
              <UnitClassList />
            </ProtectedRoute>
          }
        />
        {/* A escrita de turma exige o piso de peso do backend, que exclui o
            professor; a leitura acima segue em manage_academic. */}
        <Route
          path="/unit-class/create"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 4]}>
              <UnitClassForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/unit-class/:id/edit"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 4]}>
              <UnitClassForm />
            </ProtectedRoute>
          }
        />

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

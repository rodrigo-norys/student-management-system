import { Routes, Route } from 'react-router-dom';

import MyRoute from './MyRoute';
import Layout from '../components/Layout';

// --- System & Auth ---
import Home from '../pages/Home';
import Login from '../pages/Auth/Login';
import SetupPassword from '../pages/Auth/SetupPassword';
import Register from '../pages/Auth/Register';
import Photos from '../pages/System/Photos';
import Page404 from '../pages/System/Page404';

// --- Student Domain ---
import StudentList from '../pages/Student/StudentList';
import StudentForm from '../pages/Student/StudentForm';
import StudentProfile from '../pages/Student/StudentProfile';

// --- Staff Domain ---
import StaffList from '../pages/Staff/StaffList';
import StaffMember from '../pages/Staff/StaffForm';
import StaffProfile from '../pages/Staff/StaffProfile';

// --- Guardian Domain ---
import GuardianList from '../pages/Guardian/GuardianList';
import GuardianForm from '../pages/Guardian/GuardianForm';
import GuardianProfile from '../pages/Guardian/GuardianProfile';

// prettier-ignore
export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Dashboard Principal */}
        <Route path="/" element={<MyRoute isClosed><Home /></MyRoute>} />

        {/* Administração de Acesso */}
        <Route path="/register" element={<MyRoute isClosed><Register /></MyRoute>} />

        {/* Domínio: Student */}
        <Route path="/students" element={<MyRoute isClosed><StudentList /></MyRoute>} />
        <Route path="/student/create" element={<MyRoute isClosed><StudentForm /></MyRoute>} />
        <Route path="/student/:id/edit" element={<MyRoute isClosed><StudentForm /></MyRoute>} />
        <Route path="/student/:id" element={<MyRoute isClosed><StudentProfile /></MyRoute>} />

        {/* Domínio: Staff */}
        <Route path="/staff" element={<MyRoute isClosed><StaffList /></MyRoute>} />
        <Route path="/staff/create" element={<MyRoute isClosed><StaffMember /></MyRoute>} />
        <Route path="/staff/:id/edit" element={<MyRoute isClosed><StaffMember /></MyRoute>} />
        <Route path="/staff/:id" element={<MyRoute isClosed><StaffProfile /></MyRoute>} />

        {/* Domínio: Guardian */}
        <Route path="/guardians" element={<MyRoute isClosed><GuardianList /></MyRoute>} />
        <Route path="/guardian/create" element={<MyRoute isClosed><GuardianForm /></MyRoute>} />
        <Route path="/guardian/:id/edit" element={<MyRoute isClosed><GuardianForm /></MyRoute>} />
        <Route path="/guardian/:id" element={<MyRoute isClosed><GuardianProfile /></MyRoute>} />

        {/* Utilitários de Sistema */}
        <Route path="/avatar/:userType/:id" element={<MyRoute isClosed><Photos /></MyRoute>} />
      </Route>

      {/* Fluxo de Autenticação e Erros */}
      <Route path="/setup-password" element={<MyRoute isClosed><SetupPassword /></MyRoute>} />
      <Route path="/login" element={<MyRoute isClosed={false}><Login /></MyRoute>} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

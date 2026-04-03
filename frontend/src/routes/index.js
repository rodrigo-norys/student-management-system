import { Routes, Route } from 'react-router-dom';

import MyRoute from './MyRoute';
import Layout from '../components/Layout';

import Home from '../pages/Home';
import Students from '../pages/Students';
import Student from '../pages/Student';
import Photos from '../pages/Photos';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Page404 from '../pages/Page404';
import StudentProfile from '../pages/StudentProfile';
import SetupPassword from '../pages/SetupPassword';

import Staff from '../pages/Staff';
import StaffMember from '../pages/StaffMember';
import StaffProfile from '../pages/StaffProfile';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MyRoute isClosed><Home /></MyRoute>} />

        <Route path="/students" element={<MyRoute isClosed><Students /></MyRoute>} />
        <Route path="/student/:id/edit" element={<MyRoute isClosed><Student /></MyRoute>} />
        <Route path="/student/:id" element={<MyRoute isClosed><StudentProfile /></MyRoute>} />
        <Route path="/student/create" element={<MyRoute isClosed><Student /></MyRoute>} />

        <Route path="/staff" element={<MyRoute isClosed><Staff /></MyRoute>} />
        <Route path="/staff/create" element={<MyRoute isClosed><StaffMember /></MyRoute>} />
        <Route path="/staff/:id/edit" element={<MyRoute isClosed><StaffMember /></MyRoute>} />
        <Route path="/staff/:id" element={<MyRoute isClosed><StaffProfile /></MyRoute>} />

        <Route path="/avatar/:userType/:id" element={<MyRoute isClosed><Photos /></MyRoute>} />
        <Route path="/register" element={<MyRoute isClosed><Register /></MyRoute>} />
      </Route>

      <Route path="/setup-password" element={<MyRoute isClosed><SetupPassword /></MyRoute>} />

      <Route path="/login" element={<MyRoute isClosed={false}><Login /></MyRoute>} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

import { Routes, Route } from 'react-router-dom';

import MyRoute from './MyRoute';

import Students from '../pages/Students';
import Student from '../pages/Student';
import Photos from '../pages/Photos';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Page404 from '../pages/Page404';
import StudentProfile from '../pages/StudentProfile';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MyRoute isClosed={false}><Students /></MyRoute>} />
      <Route path="/student/:id/edit" element={<MyRoute isClosed><Student /></MyRoute>} />
      <Route path="/student/:id" element={<MyRoute isClosed><StudentProfile /></MyRoute>} />
      <Route path="/student/create" element={<MyRoute isClosed><Student /></MyRoute>} />
      <Route path="/avatar/:id" element={<MyRoute isClosed><Photos /></MyRoute>} />
      <Route path="/login" element={<MyRoute isClosed={false}><Login /></MyRoute>} />
      <Route path="/register" element={<MyRoute isClosed><Register /></MyRoute>} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

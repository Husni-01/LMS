import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CourseListPage from './pages/CourseListPage'
import CourseDetailPage from './pages/CourseDetailPage'
import DashboardHome from './pages/dashboard/DashboardHome'
import AddCourse from './pages/dashboard/AddCourse'
import MyCourses from './pages/dashboard/MyCourses'
import StudentsEnrolled from './pages/dashboard/StudentsEnrolled'
import AddAdmin from './pages/dashboard/AddAdmin'
import LoginPage from './pages/LoginPage'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import ProfilePage from './pages/ProfilePage'
import { MainLayout, EducatorLayout } from './components/Layouts'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Public Pages Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="course/:id" element={<CourseDetailPage />} />
        <Route path="payment-success" element={<PaymentSuccess />} />
        <Route path="payment-cancel" element={<PaymentCancel />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Educator Dashboard Layout */}
      <Route path="/educator" element={<EducatorLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="add-course" element={<AddCourse />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="students" element={<StudentsEnrolled />} />
        <Route path="add-admin" element={<AddAdmin />} />
      </Route>
    </Routes>
  )
}

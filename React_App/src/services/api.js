import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach Bearer token on requests if present in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (role) {
    config.headers['X-Demo-Role'] = role
  }
  return config
})

// Course API Service
export const courseService = {
  getAllCourses: () => API.get('/courses'),
  getCourseById: (id) => API.get(`/courses/${id}`),
  createCourse: (data) => API.post('/courses', data),
  updateCourse: (id, data) => API.patch(`/courses/${id}`, data),
  deleteCourse: (id) => API.delete(`/courses/${id}`),
  getEducatorCourses: () => API.get('/courses/educator/my-courses'),
}

// Auth API Service
export const authService = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  updateProfile: (data) => API.patch('/auth/updateMe', data),
  getMe: () => API.get('/auth/me'),
  addAdmin: (data) => API.post('/auth/add-admin', data),
}

// Review API Service
export const reviewService = {
  getCourseReviews: (courseId) => API.get(`/reviews/course/${courseId}`),
  addReview: (courseId, reviewData) => API.post(`/reviews/course/${courseId}`, reviewData),
}

// Payment API Service
export const paymentService = {
  createCheckoutSession: (data) => API.post('/payment/create-checkout-session', data),
  enrollAfterPayment: (data) => API.post('/payment/enroll', data),
}

export default API

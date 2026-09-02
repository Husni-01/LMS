import Course from '../models/Course.js'
import AppError from '../utils/appError.js'

// Full seed data aligned with React_App UI components
const defaultCourses = [
  {
    _id: '65c8f1e2a9b1c2d3e4f5a101',
    id: 1,
    title: 'Build Text to image SaaS App in React JS',
    subtitle: 'Master MERN Stack by building a Full Stack AI Text to Image SaaS App using React JS, MongoDB, Node.js, Express.js and Stripe Payment!',
    instructor: 'Richard James',
    rating: 4.5,
    reviewCount: 122,
    studentCount: 25,
    price: 10.99,
    originalPrice: '$19.09',
    discount: '50% off',
    badge: 'BEST SELLER',
    category: 'Web Development',
    description: 'Master fullstack SaaS development with React JS and Node.js. Build production ready projects step by step.',
    totalSections: 22,
    totalLectures: 34,
    totalDuration: '27h 25m',
    isLive: true,
    earnings: 150,
    sections: [
      {
        id: 1,
        title: 'Project Introduction',
        lectures: 3,
        duration: '45 m',
        open: true,
        items: [
          { title: 'App Overview – Build Text-to-Image SaaS', duration: '10 mins' },
          { title: 'Tech Stack – React, Node.js, MongoDB', duration: '15 mins' },
          { title: 'Core Features – Authentication, payment, deployment', duration: '20 mins' },
        ],
      },
      {
        id: 2,
        title: 'Project Setup and configuration',
        lectures: 4,
        duration: '45 m',
        open: false,
        items: [
          { title: 'Environment Setup – Install Node.js, VS Code', duration: '10 mins' },
          { title: 'Repository Setup – Clone project repository', duration: '10 mins' },
          { title: 'Install Dependencies – Install npm packages', duration: '10 mins' },
          { title: 'Initial Configuration – Set up basic files and folders', duration: '15 mins' },
        ],
      },
    ],
    includes: [
      'Lifetime access with free updates.',
      'Step-by-step, hands-on project guidance.',
      'Downloadable resources and source code.',
      'Access to test your knowledge.',
      'Certificate of completion.',
      'Quizzes to test your knowledge.',
    ],
  },
  {
    _id: '65c8f1e2a9b1c2d3e4f5a102',
    id: 2,
    title: 'Build AI BG Removal SaaS App in React JS',
    subtitle: 'Learn AI API integrations and image processing in React JS & Express.',
    instructor: 'Richard James',
    rating: 4.5,
    reviewCount: 322,
    studentCount: 28,
    price: 10.99,
    originalPrice: '$19.09',
    discount: '50% off',
    badge: 'HOT',
    category: 'AI Apps',
    description: 'Learn how to integrate AI image removal APIs into React web apps.',
    totalSections: 15,
    totalLectures: 24,
    totalDuration: '18h 10m',
    isLive: true,
    earnings: 100,
    sections: [
      {
        id: 1,
        title: 'Introduction to AI Background Removal',
        lectures: 2,
        duration: '30 m',
        open: true,
        items: [{ title: 'Overview of RemoveBG API', duration: '15 mins' }],
      },
    ],
    includes: ['Lifetime access', 'Certificate of completion'],
  },
  {
    _id: '65c8f1e2a9b1c2d3e4f5a103',
    id: 3,
    title: 'React Router Complete Course in One Video',
    subtitle: 'Master React Router v7 layout routes, loaders, actions, and dynamic parameters.',
    instructor: 'Richard James',
    rating: 4.5,
    reviewCount: 122,
    studentCount: 22,
    price: 10.99,
    originalPrice: '$19.09',
    discount: '50% off',
    badge: 'NEW',
    category: 'Frontend',
    description: 'Complete breakdown of modern React client routing.',
    totalSections: 10,
    totalLectures: 18,
    totalDuration: '12h 00m',
    isLive: true,
    earnings: 50,
    sections: [],
    includes: ['Source code access', 'Certificate of completion'],
  },
  {
    _id: '65c8f1e2a9b1c2d3e4f5a104',
    id: 4,
    title: 'Build Full Stack E-Commerce App in React JS',
    subtitle: 'Build a full featured E-Commerce store with shopping cart and checkout.',
    instructor: 'Richard James',
    rating: 4.5,
    reviewCount: 122,
    studentCount: 8,
    price: 10.99,
    originalPrice: '$19.09',
    discount: '50% off',
    badge: 'MERN app',
    category: 'Full Stack',
    description: 'E-commerce platform build with cart state management and admin dashboard.',
    totalSections: 30,
    totalLectures: 50,
    totalDuration: '35h 40m',
    isLive: true,
    earnings: 200,
    sections: [],
    includes: ['Complete project source code', 'Lifetime support'],
  },
]

export const getAllCourses = async (req, res, next) => {
  try {
    let dbCourses = []
    try {
      // DB courses first, newest on top, only live ones for public
      dbCourses = await Course.find({ isLive: true }).sort({ createdAt: -1 })
    } catch (e) {
      dbCourses = []
    }

    let combined = []

    if (dbCourses && dbCourses.length > 0) {
      // DB courses take priority — put them first
      combined = [...dbCourses]

      // Then append any hardcoded defaults that are NOT already in DB
      defaultCourses
        .filter(c => c.isLive !== false)
        .forEach((dc) => {
          const idStr = dc._id ? String(dc._id) : String(dc.id)
          const alreadyIn = combined.some(
            (c) => (c._id && c._id.toString() === idStr) || String(c.id) === idStr
          )
          if (!alreadyIn) combined.push(dc)
        })
    } else {
      // Fallback: DB unavailable — show hardcoded courses that are live
      combined = defaultCourses.filter(c => c.isLive !== false)
    }

    res.status(200).json({
      status: 'success',
      results: combined.length,
      data: { courses: combined },
    })
  } catch (error) {
    res.status(200).json({
      status: 'success',
      results: defaultCourses.filter(c => c.isLive !== false).length,
      data: { courses: defaultCourses.filter(c => c.isLive !== false) },
    })
  }
}


export const getCourse = async (req, res, next) => {
  try {
    let course = null
    try {
      course = await Course.findById(req.params.id)
    } catch (e) {
      // Ignore CastError for fallback lookup
    }

    if (!course) {
      course = defaultCourses.find((c) => c._id === req.params.id || String(c.id) === String(req.params.id))
    }

    if (!course) {
      return next(new AppError('No course found with that ID', 404))
    }

    res.status(200).json({
      status: 'success',
      data: { course },
    })
  } catch (error) {
    next(error)
  }
}

export const createCourse = async (req, res, next) => {
  try {
    let newCourse
    try {
      newCourse = await Course.create(req.body)
    } catch (dbErr) {
      // If DB creation fails (e.g. offline/mock DB), create in memory
      newCourse = {
        _id: Date.now().toString(),
        id: Date.now(),
        rating: 5.0,
        reviewCount: 0,
        studentCount: 0,
        earnings: req.body.price ? Number(req.body.price) * 10 : 100,
        isLive: true,
        sections: [],
        includes: ['Lifetime access with free updates.', 'Certificate of completion.'],
        ...req.body,
      }
      defaultCourses.unshift(newCourse)
    }

    res.status(201).json({
      status: 'success',
      data: { course: newCourse },
    })
  } catch (error) {
    const fallbackCourse = {
      _id: Date.now().toString(),
      id: Date.now(),
      rating: 5.0,
      reviewCount: 0,
      studentCount: 0,
      earnings: 100,
      isLive: true,
      ...req.body,
    }
    defaultCourses.unshift(fallbackCourse)
    res.status(201).json({
      status: 'success',
      data: { course: fallbackCourse },
    })
  }
}

export const updateCourse = async (req, res, next) => {
  try {
    let course = null
    try {
      course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
    } catch (e) {
      // Non-ObjectId fallback
    }

    // Update in-memory defaultCourses if present
    const idx = defaultCourses.findIndex(
      (c) => (c._id && c._id.toString() === req.params.id) || String(c.id) === String(req.params.id)
    )
    if (idx !== -1) {
      defaultCourses[idx] = { ...defaultCourses[idx], ...req.body }
      if (!course) {
        course = defaultCourses[idx]
        // Upsert to MongoDB so the edit persists across restarts
        try {
          const newDbCourse = await Course.create({ ...course, _id: undefined }) // Let Mongo assign a real _id if it's a fake one, or use it if valid
          course = newDbCourse
        } catch (upsertErr) {
          // Fallback to memory if DB is offline
        }
      }
    }

    if (!course) {
      return next(new AppError('No course found with that ID to update', 404))
    }

    res.status(200).json({
      status: 'success',
      data: { course },
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCourse = async (req, res, next) => {
  try {
    try {
      await Course.findByIdAndDelete(req.params.id)
    } catch (e) {}

    const idx = defaultCourses.findIndex(
      (c) => (c._id && c._id.toString() === req.params.id) || String(c.id) === String(req.params.id)
    )
    if (idx !== -1) {
      defaultCourses.splice(idx, 1)
    }

    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (error) {
    next(error)
  }
}

export const getEducatorCourses = async (req, res, next) => {
  try {
    let dbCourses = []
    try {
      dbCourses = await Course.find()
    } catch (e) {
      dbCourses = []
    }

    const combined = [...defaultCourses]
    if (dbCourses && dbCourses.length > 0) {
      dbCourses.forEach((dbc) => {
        const idStr = dbc._id ? dbc._id.toString() : String(dbc.id)
        const exists = combined.some((c) => (c._id && c._id.toString() === idStr) || String(c.id) === idStr)
        if (!exists) {
          combined.unshift(dbc)
        }
      })
    }

    res.status(200).json({
      status: 'success',
      results: combined.length,
      data: { courses: combined },
    })
  } catch (error) {
    res.status(200).json({
      status: 'success',
      results: defaultCourses.length,
      data: { courses: defaultCourses },
    })
  }
}

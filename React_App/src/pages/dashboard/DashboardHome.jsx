import { useState, useEffect } from 'react'
import Avatar from '../../components/Avatar'

const mockProps = {
  stats: [
    { label: 'Total Enrolments', value: 14, icon: 'enroll' },
    { label: 'Total Courses', value: 8, icon: 'courses' },
    { label: 'Total Earnings', value: '$245', icon: 'earnings' },
  ],
  enrollments: [
    { id: 1, student: 'Richard Sanford', course: 'Build Text to image SaaS App in React JS', date: '22 Aug, 2024' },
    { id: 2, student: 'Enrique Murphy', course: 'Build AI BG Removal SaaS App in React JS', date: '22 Aug, 2024' },
    { id: 3, student: 'Alison Powell', course: 'React Router Complete Course in One Video', date: '25 Sep, 2024' },
    { id: 4, student: 'Richard Sanford', course: 'Build Full Stack E-Commerce App in React JS', date: '15 Oct, 2024' },
  ],
}

export default function DashboardHome({ props = mockProps }) {
  const { stats, enrollments } = props

  return (
    <div className="p-8 font-['Outfit',sans-serif]">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Latest Enrolments */}
      <h2 className="text-[18px] font-semibold text-[#1f2937] mb-4">Latest Enrolments</h2>

      <div className="border border-[rgba(37,37,37,0.2)] rounded-md overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[40px_1fr_2fr_160px] items-center bg-white border-b border-[rgba(37,37,37,0.15)] px-4 py-3">
          <span className="text-[14px] font-semibold text-[#252525]">#</span>
          <span className="text-[14px] font-semibold text-[#252525]">Student name</span>
          <span className="text-[14px] font-semibold text-[#252525]">Course Title</span>
          <span className="text-[14px] font-semibold text-[#252525]">Date</span>
        </div>

        {enrollments.map((row, i) => (
          <div
            key={row.id}
            className={`grid grid-cols-[40px_1fr_2fr_160px] items-center px-4 py-3 border-b border-[rgba(37,37,37,0.1)] last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}
          >
            <span className="text-[14px] text-[rgba(37,37,37,0.7)]">{row.id}</span>
            <div className="flex items-center gap-2">
              <Avatar name={row.student} size={35} />
              <span className="text-[14px] text-[rgba(37,37,37,0.7)]">{row.student}</span>
            </div>
            <span className="text-[14px] text-[rgba(37,37,37,0.7)] pr-4">{row.course}</span>
            <span className="text-[14px] text-[rgba(37,37,37,0.7)]">{row.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ stat }) {
  const icons = {
    enroll: <EnrollIcon />,
    courses: <CoursesIcon />,
    earnings: <EarningsIcon />,
  }
  return (
    <div className="flex items-center gap-4 border border-[rgba(37,37,37,0.2)] rounded-md p-5 bg-white">
      <div className="w-12 h-12 rounded-full bg-[#EBF7FF] flex items-center justify-center shrink-0">
        {icons[stat.icon]}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#0e0e0e]">{stat.value}</p>
        <p className="text-[14px] text-[rgba(37,37,37,0.6)]">{stat.label}</p>
      </div>
    </div>
  )
}

function EnrollIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="9" cy="7" r="4" stroke="#0260FF" strokeWidth="1.8" />
      <path d="M3 20c0-3.866 3.134-7 7-7" stroke="#0260FF" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 13v6M13 16h6" stroke="#0260FF" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CoursesIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="3" width="18" height="14" rx="2" stroke="#0260FF" strokeWidth="1.8" />
      <path d="M7 8h8M7 12h5" stroke="#0260FF" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function EarningsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" stroke="#0260FF" strokeWidth="1.8" />
      <path d="M11 6v1.5M11 14.5V16M8.5 13.5c0 1.1.9 2 2.5 2s2.5-.9 2.5-2-1-1.8-2.5-2-2.5-.9-2.5-2 .9-2 2.5-2 2.5.9 2.5 2"
        stroke="#0260FF" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

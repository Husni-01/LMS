import Avatar from '../../components/Avatar'

const mockProps = {
  enrollments: [
    { id: 1, student: 'Richard Sanford', course: 'Build Text to image SaaS App in React JS', date: '22 Aug, 2024' },
    { id: 2, student: 'Enrique Murphy', course: 'Build AI BG Removal SaaS App in React JS', date: '22 Aug, 2024' },
    { id: 3, student: 'Alison Powell', course: 'React Router Complete Course in One Video', date: '25 Sep, 2024' },
    { id: 4, student: 'Richard Sanford', course: 'Build Full Stack E-Commerce App in React JS', date: '15 Oct, 2024' },
    { id: 5, student: 'Enrique Murphy', course: 'Build AI BG Removal SaaS App in React JS', date: '22 Aug, 2024' },
    { id: 6, student: 'Alison Powell', course: 'React Router Complete Course in One Video', date: '25 Sep, 2024' },
  ],
}

export default function StudentsEnrolled({ props = mockProps }) {
  const { enrollments } = props

  return (
    <div className="p-8 font-['Outfit',sans-serif]">
      <h2 className="text-[18px] font-semibold text-[#1f2937] mb-4">Students Enrolled</h2>
      <div className="border border-[rgba(37,37,37,0.2)] rounded-md overflow-hidden bg-white">
        {/* Header */}
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

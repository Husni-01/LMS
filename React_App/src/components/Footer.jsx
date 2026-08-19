import { useState } from 'react'

const defaultProps = {
  brandName: 'Edemy',
  description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text.',
  companyLinks: ['Home', 'About us', 'Contact us', 'Privacy policy'],
  newsletterTitle: 'Subscribe to our newsletter',
  newsletterDesc: 'The latest news, articles, and resources, sent to your inbox weekly.',
  copyright: 'Copyright 2024 © Edemy. All Right Reserved.',
}

export default function Footer({ props = defaultProps }) {
  const [email, setEmail] = useState('')
  const { brandName, description, companyLinks, newsletterTitle, newsletterDesc, copyright } = props

  return (
    <footer className="bg-[#1a1a2e] text-white font-['Outfit',sans-serif]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <LogoMark />
            <span className="text-2xl font-semibold">{brandName}</span>
          </div>
          <p className="text-[14px] text-[rgba(255,255,255,0.7)] leading-relaxed">{description}</p>
        </div>

        {/* Company links */}
        <div>
          <h3 className="text-[16px] font-semibold mb-5">Company</h3>
          <ul className="space-y-3">
            {companyLinks.map((link) => (
              <li key={link}>
                <a href="#" className="text-[14px] text-[rgba(255,255,255,0.7)] hover:text-white transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-[16px] font-semibold mb-3">{newsletterTitle}</h3>
          <p className="text-[14px] text-[rgba(255,255,255,0.7)] mb-5 leading-relaxed">{newsletterDesc}</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] text-white text-[14px] placeholder:text-[rgba(255,255,255,0.4)] outline-none focus:border-[#0260FF]"
            />
            <button className="bg-[#0260FF] text-white text-[14px] font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(255,255,255,0.1)] text-center py-5 text-[14px] text-[rgba(255,255,255,0.5)]">
        {copyright}
      </div>
    </footer>
  )
}

function LogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 34 34" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M17 0C7.611 0 0 7.611 0 17s7.611 17 17 17 17-7.611 17-17S26.389 0 17 0zm-3 9l10 8-10 8V9z"
        fill="#0260FF" />
    </svg>
  )
}

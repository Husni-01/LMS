export function LogoMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="17" fill="#0260FF" />
      <polygon points="13,10 24,17 13,24" fill="white" />
    </svg>
  )
}

export function UserIcon() {
  return (
    <svg width="19" height="21" viewBox="0 0 19 21" fill="none">
      <path d="M9.5 10a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm-8.5 10c0-4.694 3.806-8.5 8.5-8.5S18 15.306 18 20"
        stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SocialIcon({ type }) {
  if (type === 'facebook') return (
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
      <circle cx="17.5" cy="17.5" r="17.25" stroke="#5E5E5E" strokeWidth="0.5" />
      <path d="M19.5 12.5H18a1.5 1.5 0 0 0-1.5 1.5v2H19l-.5 3H16.5v7H14v-7h-2v-3h2V14a4 4 0 0 1 4-4h1.5v2.5z" fill="black" />
    </svg>
  )
  if (type === 'twitter') return (
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
      <circle cx="17.5" cy="17.5" r="17.25" stroke="#5E5E5E" strokeWidth="0.5" />
      <path d="M26 11c-1 .7-2.1 1.1-3.2 1.4C21.8 11.1 20.5 10 19 10c-2.8 0-4.7 2.8-4 5.4C11.3 15.2 8.7 13.6 7 11.4c-.9 1.6-.4 3.7 1 4.7-.6 0-1.2-.2-1.7-.4 0 1.7 1.2 3.2 2.9 3.5-.5.1-1.1.2-1.6.1.5 1.5 1.8 2.5 3.4 2.5C10.2 22.8 8 23.5 6 23.5c1.7 1.1 3.7 1.7 5.8 1.7 7 0 10.8-5.9 10.6-11.2.8-.5 1.4-1.2 1.8-2-.7.3-1.5.5-2.2.6z" fill="black" />
    </svg>
  )
  return (
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
      <circle cx="17.5" cy="17.5" r="17.25" stroke="#5E5E5E" strokeWidth="0.5" />
      <rect x="11" y="11" width="13" height="13" rx="3.5" stroke="#222" strokeWidth="1.5" />
      <circle cx="17.5" cy="17.5" r="3" stroke="#222" strokeWidth="1.5" />
      <circle cx="21.2" cy="13.8" r="0.8" fill="#222" />
    </svg>
  )
}

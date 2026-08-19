import { useState } from 'react'

export default function Toggle({ initialValue = true, onChange = null, label = true }) {
  const [on, setOn] = useState(initialValue)

  const handleToggle = () => {
    const next = !on
    setOn(next)
    onChange && onChange(next)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        className={`relative w-[39px] h-[21px] rounded-full transition-colors ${on ? 'bg-[#2563eb]' : 'bg-[#cbd5e1]'}`}
        aria-label="toggle course status"
      >
        <span
          className={`absolute top-[3px] w-[15px] h-[15px] rounded-full bg-white shadow transition-transform ${on ? 'translate-x-[21px]' : 'translate-x-[3px]'}`}
        />
      </button>
      {label && (
        <span className="text-[14px] text-[rgba(37,37,37,0.7)] font-['Outfit',sans-serif]">
          {on ? 'Live' : 'Private'}
        </span>
      )}
    </div>
  )
}

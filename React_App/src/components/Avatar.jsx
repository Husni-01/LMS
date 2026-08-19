const COLORS = [
  '#0260FF', '#e94560', '#40916c', '#9d4edd', '#f59e0b', '#06b6d4',
]

export default function Avatar({ name = '?', src = null, size = 35 }) {
  const initial = name.trim().charAt(0).toUpperCase()
  const bg = COLORS[name.charCodeAt(0) % COLORS.length]

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0 font-['Outfit',sans-serif]"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  )
}

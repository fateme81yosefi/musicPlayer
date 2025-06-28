export default function SpeakerIcon({ color = "currentColor", size = 30 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={au}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 9 9 9 13 5 13 19 9 15 3 15" />
      <path d="M16 8a4 4 0 0 1 0 8" />
      <path d="M19 5a7 7 0 0 1 0 14" />
    </svg>
  );
}

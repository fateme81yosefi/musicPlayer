export default function SpeakerIcon({ color = "currentColor", size = 24 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      style={{ display: "block" }}
    >
      <path d="M11 5 L6 9 H3 v6 h3 l5 4 z" />
      <path d="M16.5 12 a4.5 4.5 0 0 1 0 0" />
      <path d="M19.5 8 a8.5 8.5 0 0 1 0 8" />
    </svg>
  );
}

import { Link } from 'react-router-dom';

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" className="logo" onClick={onClick}>
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="7" y="5" width="18" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M11 13h10M11 17h10M11 21h6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="logo-word">Leva</span>
      <span className="logo-ai">AI</span>
    </Link>
  );
}

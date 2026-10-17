import { Link } from 'react-router-dom';

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" className="logo" onClick={onClick}>
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 26V7h3.4v15.4H26V26H5Z" fill="currentColor" />
        <path d="M14 7h11.2v3.2H17.4V17" stroke="var(--copper)" strokeWidth="2.2" fill="none" />
      </svg>
      <span className="logo-word">Leva</span>
      <span className="logo-ai">AI</span>
      <span className="sr">home</span>
    </Link>
  );
}

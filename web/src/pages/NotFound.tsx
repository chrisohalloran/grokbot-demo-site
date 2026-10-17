import { Link } from 'react-router-dom';
import { useTitle } from '../hooks';

export default function NotFound() {
  useTitle('Page not found — Leva AI');
  return (
    <main id="main" tabIndex={-1} className="section">
      <div className="wrap" style={{ display: 'grid', gap: '1rem' }}>
        <p className="kicker">404</p>
        <h1 className="display-2">This sheet isn’t in the set.</h1>
        <p className="lede">The address doesn’t match a page on this demo.</p>
        <Link className="btn" to="/" style={{ width: 'fit-content' }}>
          Back to the drawing
        </Link>
      </div>
    </main>
  );
}

import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';

export default function NotFound() {
  useDocumentMeta('Page not found');
  return (
    <div className="container not-found">
      <p className="eyebrow">404</p>
      <h1 className="page-title">Page not found</h1>
      <div className="not-found__actions">
        <Link to="/" className="btn btn--outline">Home</Link>
        <Link to="/menu" className="btn btn--primary">Menu</Link>
      </div>
    </div>
  );
}

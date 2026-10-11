import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';

export default function NotFound() {
  useDocumentMeta('Page not found');
  return (
    <div className="container not-found">
      <p className="eyebrow">404</p>
      <h1 className="page-title">This page isn’t on the menu</h1>
      <p>The link may be old or mistyped.</p>
      <div className="not-found__actions">
        <Link to="/" className="btn btn--outline">Home</Link>
        <Link to="/menu" className="btn btn--primary">See the menu</Link>
      </div>
    </div>
  );
}

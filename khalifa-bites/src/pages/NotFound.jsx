import { Link } from 'react-router-dom';
import useDocumentMeta from '../hooks/useDocumentMeta';
import Icon from '../components/Icon';

export default function NotFound() {
  useDocumentMeta('Page not found', 'This page doesn’t exist.');
  return (
    <div className="container narrow-page empty-state">
      <span className="empty-state__icon" aria-hidden="true"><Icon name="alert" size={36} /></span>
      <h1 className="page-title">This page isn’t on the menu.</h1>
      <p>The link may be old, or the page moved.</p>
      <Link to="/" className="btn btn--primary">Go to the homepage</Link>
    </div>
  );
}
